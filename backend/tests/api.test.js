/**
 * API Integration tests
 * Tests all API endpoints with mocked dependencies
 */
const request = require('supertest');
const express = require('express');
const { createContainer } = require('../src/utils/ServiceFactory');

// Mock database
jest.mock('../src/config/database', () => ({
  execute: jest.fn(),
  getConnection: jest.fn()
}));

const pool = require('../src/config/database');

describe('API Integration Tests', () => {
  let app;
  let container;
  let testToken;

  beforeAll(() => {
    // Create app for testing
    app = express();
    app.use(express.json());
    
    container = createContainer();
    
    const authController = container.get('authController');
    const configController = container.get('configController');
    const calculationController = container.get('calculationController');
    const authMiddleware = container.get('authMiddleware');
    
    // Auth routes
    app.post('/auth/register', (req, res) => authController.register(req, res));
    app.post('/auth/login', (req, res) => authController.login(req, res));
    
    // Config routes (protected)
    app.get('/config', (req, res) => authMiddleware.authenticate(req, res, (err) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      configController.get(req, res);
    }));
    app.put('/config', (req, res) => authMiddleware.authenticate(req, res, (err) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      configController.update(req, res);
    }));
    
    // Calculation routes (protected)
    app.post('/calculate', (req, res) => authMiddleware.authenticate(req, res, (err) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      calculationController.calculate(req, res);
    }));
    app.get('/calculate', (req, res) => authMiddleware.authenticate(req, res, (err) => {
      if (err) return res.status(401).json({ error: 'Invalid token' });
      calculationController.getHistory(req, res);
    }));
    
    // Generate test token
    const tokenService = container.get('tokenService');
    testToken = tokenService.generate({ id: 1, email: 'test@example.com' });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Auth Endpoints', () => {
    describe('POST /auth/register', () => {
      it('should register a new user', async () => {
        pool.execute.mockResolvedValueOnce([{ insertId: 1 }, []]);
        pool.execute.mockResolvedValueOnce([[], []]);

        const response = await request(app)
          .post('/auth/register')
          .send({ email: 'new@example.com', password: 'password123' });

        expect(response.status).toBe(201);
        expect(response.body.token).toBeDefined();
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
        const error = new Error('Duplicate entry');
        error.code = 'ER_DUP_ENTRY';
        pool.execute.mockRejectedValueOnce(error);

        const response = await request(app)
          .post('/auth/register')
          .send({ email: 'existing@example.com', password: 'password123' });

        expect(response.status).toBe(409);
        expect(response.body.error).toBe('Email already exists');
      });
    });

    describe('POST /auth/login', () => {
      it('should login successfully', async () => {
        const { PasswordHasher } = require('../src/services/PasswordHasher');
        const hasher = new PasswordHasher();
        const passwordHash = await hasher.hash('password123');
        
        pool.execute.mockResolvedValueOnce([[{ 
          id: 1, 
          email: 'test@example.com', 
          password_hash: passwordHash 
        }], []]);

        const response = await request(app)
          .post('/auth/login')
          .send({ email: 'test@example.com', password: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
      });

      it('should reject invalid credentials', async () => {
        pool.execute.mockResolvedValueOnce([[], []]);

        const response = await request(app)
          .post('/auth/login')
          .send({ email: 'nonexistent@example.com', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid credentials');
      });
    });
  });

  describe('Config Endpoints', () => {
    describe('GET /config', () => {
      it('should return user config', async () => {
        pool.execute.mockResolvedValueOnce([[{
          user_id: 1,
          days_per_month: '4.22',
          hours_per_day: '8.0',
          expense_per_day: '3.69',
          salary_multiplier: '9.5',
          expense_multiplier: '1.0'
        }], []]);

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
    });

    describe('PUT /config', () => {
      it('should update user config', async () => {
        pool.execute.mockResolvedValueOnce([{ affectedRows: 1 }, []]);
        pool.execute.mockResolvedValueOnce([[{
          user_id: 1,
          days_per_month: '5.0',
          hours_per_day: '7.5',
          expense_per_day: '4.0',
          salary_multiplier: '10.0',
          expense_multiplier: '1.2'
        }], []]);

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
    });
  });

  describe('Calculate Endpoints', () => {
    describe('POST /calculate', () => {
      it('should calculate salary', async () => {
        pool.execute.mockResolvedValueOnce([[{
          user_id: 1,
          days_per_month: '4.22',
          hours_per_day: '8.0',
          expense_per_day: '3.69',
          salary_multiplier: '9.5',
          expense_multiplier: '1.0'
        }], []]);
        pool.execute.mockResolvedValueOnce([{ insertId: 1 }, []]);

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
    });

    describe('GET /calculate', () => {
      it('should return calculation history', async () => {
        pool.execute.mockResolvedValueOnce([[{
          id: 1,
          user_id: 1,
          input_days: '20',
          input_expense_days: '20',
          hours_total: '160',
          salary_total: '801.8',
          expense_total: '73.8',
          grand_total: '875.6',
          created_at: new Date()
        }], []]);

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
