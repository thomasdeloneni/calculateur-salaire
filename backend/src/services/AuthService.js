/**
 * AuthService - Authentication business logic
 */
const UserRepository = require('../repositories/UserRepository');
const ConfigRepository = require('../repositories/ConfigRepository');
const PasswordHasher = require('./PasswordHasher');
const TokenService = require('./TokenService');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
    this.configRepository = new ConfigRepository();
    this.passwordHasher = new PasswordHasher();
    this.tokenService = new TokenService();
  }

  /**
   * Register a new user
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async register(userData) {
    const { email, password, first_name, last_name } = userData;

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Hash password
    const password_hash = await this.passwordHasher.hash(password);

    // Create user
    const user = await this.userRepository.create({
      email,
      password_hash,
      first_name,
      last_name
    });

    // Create default config for user
    await this.configRepository.create({
      user_id: user.id,
      days_per_month: 4.22,
      hours_per_day: 8.0,
      expense_per_day: 3.69,
      salary_multiplier: 9.5,
      expense_multiplier: 1.0
    });

    // Generate token
    const token = this.tokenService.generate({
      userId: user.id,
      email: user.email
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token
    };
  }

  /**
   * Login a user
   * @param {Object} credentials
   * @returns {Promise<Object>}
   */
  async login(credentials) {
    const { email, password } = credentials;

    // Find user
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValid = await this.passwordHasher.verify(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.tokenService.generate({
      userId: user.id,
      email: user.email
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      },
      token
    };
  }

  /**
   * Verify token and get user
   * @param {string} token
   * @returns {Promise<Object>}
   */
  async verifyToken(token) {
    const decoded = this.tokenService.verify(token);
    if (!decoded) {
      throw new Error('Invalid or expired token');
    }

    const user = await this.userRepository.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    };
  }

  /**
   * Get user profile
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      created_at: user.created_at
    };
  }

  /**
   * Update user profile
   * @param {string} userId
   * @param {Object} updateData
   * @returns {Promise<Object>}
   */
  async updateProfile(userId, updateData) {
    const { first_name, last_name, email } = updateData;

    // Check email uniqueness if changing email
    if (email) {
      const existingUser = await this.userRepository.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new Error('Email already in use');
      }
    }

    const user = await this.userRepository.update(userId, {
      first_name,
      last_name,
      email
    });

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name
    };
  }
}

module.exports = AuthService;
