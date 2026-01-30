/**
 * API Integration tests
 * Tests all API endpoints with mocked dependencies
 */
const request = require('supertest');
const express = require('express');

// Create mock repositories
const mockUserRepository = {
  findByEmail: jest.fn(),
  findById: jest.fn(),
  create: jest.fn()
};

const mockConfigRepository = {
  findByUserId: jest.fn(),
  createDefault: jest.fn(),
  update: jest.fn()
};

const mockCalculationRepository = {
  save: jest.fn(),
  findByUserId: jest.fn()
};

const mockPasswordHasher = {
  hash: jest.fn().mockResolvedValue('$argon2i$hashedpassword'),
  verify: jest.fn().mockResolvedValue(true)
};

const mockTokenService = {
  generate: jest.fn().mockReturnValue('mock-token'),
  verify: jest.fn().mockReturnValue({ id: 1, email: 'test@example.com' })
};

const mockSalaryCalculator = {
  calculate: jest.fn().mockReturnValue({
    days_presence: 20,
    days_expense: 20,
    hours_total: 160,
    salary_base: 801.8,
    expense_total: 73.8,
    grand_total: 875.6,
    toJSON: function() {
      return {
        days_presence: this.days_presence,
        days_expense: this.days_expense,
        hours_total: this.hours_total,
        salary_base: this.salary_base,
        expense_total: this.expense_total,
        grand_total: this.grand_total
      };
    }
  })
};

// Import services with mocked dependencies
const AuthService = require('../src/services/AuthService');
const ConfigService = require('../src/services/ConfigService');
const CalculationService = require('../src/services/CalculationService');
const AuthController = require('../src/controllers/AuthController');
const ConfigController = require('../src/controllers/ConfigController');
const CalculationController = require('../src/controllers/CalculationController');
const AuthMiddleware = require('../src/middleware/AuthMiddleware');

describe('API Integration Tests', () => {
  let app;
  let testToken;
  let authService;
  let configService;
  let calculationService;
  let authController;
  let configController;
  let calculationController;
  let authMiddleware;

  beforeAll(() => {
    // Create services with mocked dependencies
    authService = new AuthService(mockUserRepository, mockPasswordHasher, mockTokenService);
    configService = new ConfigService(mockConfigRepository);
    calculationService = new CalculationService(mockConfigRepository, mockCalculationRepository, mockSalaryCalculator);
    
    // Create controllers
    authController = new AuthController(authService);
    configController = new ConfigController(configService);
    calculationController = new CalculationController(calculationService);
    
    // Create middleware
    authMiddleware = new AuthMiddleware(mockTokenService);
    
    // Create app
    app = express();
    app.use(express.json());
    
    // Auth routes
    app.post('/auth/register', (req, res) => authController.register(req, res));
    app.post('/auth/login', (req, res) => authController.login(req, res));
    
    // Config routes (protected)
    app.get('/config', (req, res) => authMiddleware.authenticate(req, res, () => {
      configController.get(req, res);
    }));
    app.put('/config', (req, res) => authMiddleware.authenticate(req, res, () => {
      configController.update(req, res);
    }));
    
    // Calculation routes (protected)
    app.post('/calculate', (req, res) => authMiddleware.authenticate(req, res, () => {
      calculationController.calculate(req, res);
    }));
    app.get('/calculate', (req, res) => authMiddleware.authenticate(req, res, () => {
      calculationController.getHistory(req, res);
    }));
    
    testToken = 'mock-token';
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Endpoints', () => {
    describe('POST /auth/register', () => {
      it('should register a new user', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);
        mockUserRepository.create.mockResolvedValue({
          id: 1,
          email: 'new@example.com',
          password_hash: '$argon2i$hashedpassword',
          created_at: new Date(),
          updated_at: new Date()
        });

        const response = await request(app)
          .post('/auth/register')
          .send({ email: 'new@example.com', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.token).toBe('mock-token');
        expect(response.body.user.email).toBe('new@example.com');
      });

      it('should reject invalid email', async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({ email: '', password: 'password123' });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Email is required');
      });

      it('should reject short password', async () => {
        const response = await request(app)
          .post('/auth/register')
          .send({ email: 'test@example.com', password: '123' });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Password must be at least 6 characters');
      });

      it('should handle duplicate email', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({
          id: 1,
          email: 'existing@example.com'
        });

        const response = await request(app)
          .post('/auth/register')
          .send({ email: 'existing@example.com', password: 'password123' });

        expect(response.status).toBe(409);
        expect(response.body.error).toBe('Email already exists');
      });
    });

    describe('POST /auth/login', () => {
      it('should login successfully', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password_hash: '$argon2i$hashedpassword'
        });

        const response = await request(app)
          .post('/auth/login')
          .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('mock-token');
      });

      it('should reject invalid credentials - non-existent user', async () => {
        mockUserRepository.findByEmail.mockResolvedValue(null);

        const response = await request(app)
          .post('/auth/login')
          .send({ email: 'nonexistent@example.com', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
      });

      it('should reject invalid credentials - wrong password', async () => {
        mockUserRepository.findByEmail.mockResolvedValue({
          id: 1,
          email: 'test@example.com',
          password_hash: '$argon2i$hashedpassword'
        });
        mockPasswordHasher.verify.mockResolvedValue(false);

        const response = await request(app)
          .post('/auth/login')
          .send({ email: 'test@example.com', password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
      });
    });
  });

  describe('Config Endpoints', () => {
    describe('GET /config', () => {
      it('should return user config', async () => {
        mockConfigRepository.findByUserId.mockResolvedValue({
          user_id: 1,
          days_per_month: 4.22,
          hours_per_day: 8.0,
          expense_per_day: 3.69,
          salary_multiplier: 9.5,
          expense_multiplier: 1.0,
          toJSON: function() {
            return {
              days_per_month: this.days_per_month,
              hours_per_day: this.hours_per_day,
              expense_per_day: this.expense_per_day,
              salary_multiplier: this.salary_multiplier,
              expense_multiplier: this.expense_multiplier
            };
          }
        });

        const response = await request(app)
          .get('/config')
          .set('Authorization', `Bearer ${testToken}`);

        expect(response.status).toBe(200);
        expect(response.body.days_per_month).toBe(4.22);
      });

      it('should reject request without token', async () => {
        const response = await request(app).get('/config');

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('No token provided');
      });

      it('should create default config if not exists', async () => {
        mockConfigRepository.findByUserId.mockResolvedValue(null);
        mockConfigRepository.createDefault.mockResolvedValue({
          user_id: 1,
          days_per_month: 4.22,
          hours_per_day: 8.0,
          expense_per_day: 3.69,
          salary_multiplier: 9.5,
          expense_multiplier: 1.0,
          toJSON: function() {
            return {
              days_per_month: this.days_per_month,
              hours_per_day: this.hours_per_day,
              expense_per_day: this.expense_per_day,
              salary_multiplier: this.salary_multiplier,
              expense_multiplier: this.expense_multiplier
            };
          }
        });

        const response = await request(app)
          .get('/config')
          .set('Authorization', `Bearer ${testToken}`);

        expect(response.status).toBe(200);
        expect(mockConfigRepository.createDefault).toHaveBeenCalledWith(1);
      });
    });

    describe('PUT /config', () => {
      it('should update user config', async () => {
        mockConfigRepository.update.mockResolvedValue({
          user_id: 1,
          days_per_month: 5.0,
          hours_per_day: 7.5,
          expense_per_day: 4.0,
          salary_multiplier: 10.0,
          expense_multiplier: 1.2,
          toJSON: function() {
            return {
              days_per_month: this.days_per_month,
              hours_per_day: this.hours_per_day,
              expense_per_day: this.expense_per_day,
              salary_multiplier: this.salary_multiplier,
              expense_multiplier: this.expense_multiplier
            };
          }
        });

        const response = await request(app)
          .put('/config')
          .set('Authorization', `Bearer ${testToken}`)
          .send({
            days_per_month: 5.0,
            hours_per_day: 7.5
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Configuration updated successfully');
      });

      it('should reject invalid values', async () => {
        const response = await request(app)
          .put('/config')
          .set('Authorization', `Bearer ${testToken}`)
          .send({ days_per_month: -5 });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('days_per_month must be a positive number');
      });
    });
  });

  describe('Calculate Endpoints', () => {
    describe('POST /calculate', () => {
      it('should calculate salary', async () => {
        mockConfigRepository.findByUserId.mockResolvedValue({
          user_id: 1,
          days_per_month: 4.22,
          hours_per_day: 8.0,
          expense_per_day: 3.69,
          salary_multiplier: 9.5,
          expense_multiplier: 1.0
        });
        mockCalculationRepository.save.mockResolvedValue({
          id: 1,
          user_id: 1,
          input_days: 20,
          input_expense_days: 20,
          hours_total: 160,
          salary_total: 801.8,
          expense_total: 73.8,
          grand_total: 875.6,
          created_at: new Date()
        });

        const response = await request(app)
          .post('/calculate')
          .set('Authorization', `Bearer ${testToken}`)
          .send({ days_presence: 20 });

        expect(response.status).toBe(200);
        expect(response.body.days_presence).toBe(20);
        expect(response.body.hours_total).toBe(160);
        expect(response.body.salary_base).toBe(801.8);
        expect(response.body.grand_total).toBe(875.6);
      });

      it('should require days_presence', async () => {
        const response = await request(app)
          .post('/calculate')
          .set('Authorization', `Bearer ${testToken}`)
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('days_presence is required');
      });

      it('should reject negative days', async () => {
        const response = await request(app)
          .post('/calculate')
          .set('Authorization', `Bearer ${testToken}`)
          .send({ days_presence: -5 });

        expect(response.status).toBe(400);
        expect(response.body.error).toContain('days_presence must be a non-negative number');
      });

      it('should use default config if not exists', async () => {
        mockConfigRepository.findByUserId.mockResolvedValue(null);
        mockConfigRepository.createDefault.mockResolvedValue({
          user_id: 1,
          days_per_month: 4.22,
          hours_per_day: 8.0,
          expense_per_day: 3.69,
          salary_multiplier: 9.5,
          expense_multiplier: 1.0
        });
        mockCalculationRepository.save.mockResolvedValue({
          id: 1,
          user_id: 1,
          input_days: 20,
          input_expense_days: 20,
          hours_total: 160,
          salary_total: 801.8,
          expense_total: 73.8,
          grand_total: 875.6,
          created_at: new Date()
        });

        const response = await request(app)
          .post('/calculate')
          .set('Authorization', `Bearer ${testToken}`)
          .send({ days_presence: 20 });

        expect(response.status).toBe(200);
        expect(mockConfigRepository.createDefault).toHaveBeenCalledWith(1);
      });
    });

    describe('GET /calculate', () => {
      it('should return calculation history', async () => {
        mockCalculationRepository.findByUserId.mockResolvedValue([
          {
            id: 1,
            user_id: 1,
            input_days: 20,
            input_expense_days: 20,
            hours_total: 160,
            salary_total: 801.8,
            expense_total: 73.8,
            grand_total: 875.6,
            created_at: new Date(),
            toJSON: function() {
              return {
                id: this.id,
                days_presence: this.input_days,
                days_expense: this.input_expense_days,
                hours_total: this.hours_total,
                salary_base: this.salary_total,
                expense_total: this.expense_total,
                grand_total: this.grand_total,
                created_at: this.created_at
              };
            }
          }
        ]);

        const response = await request(app)
          .get('/calculate')
          .set('Authorization', `Bearer ${testToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].days_presence).toBe(20);
      });
    });
  });
});
