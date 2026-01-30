/**
 * AuthController - Authentication HTTP handlers
 */
const AuthService = require('../services/AuthService');
const RegisterUserDTO = require('../dto/RegisterUserDTO');
const LoginUserDTO = require('../dto/LoginUserDTO');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/register
   * Register a new user
   */
  async register(req, res) {
    try {
      const dto = new RegisterUserDTO(
        req.body.email,
        req.body.password,
        req.body.first_name,
        req.body.last_name
      );

      const validation = dto.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const result = await this.authService.register({
        email: dto.email,
        password: dto.password,
        first_name: dto.first_name,
        last_name: dto.last_name
      });

      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      if (error.message === 'Email already registered') {
        return res.status(409).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * POST /api/auth/login
   * Login a user
   */
  async login(req, res) {
    try {
      const dto = new LoginUserDTO(req.body.email, req.body.password);

      const validation = dto.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const result = await this.authService.login({
        email: dto.email,
        password: dto.password
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      if (error.message === 'Invalid email or password') {
        return res.status(401).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/auth/me
   * Get current user profile
   */
  async me(req, res) {
    try {
      const user = await this.authService.getProfile(req.user.id);
      res.json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * PUT /api/auth/profile
   * Update user profile
   */
  async updateProfile(req, res) {
    try {
      const { first_name, last_name, email } = req.body;

      const user = await this.authService.updateProfile(req.user.id, {
        first_name,
        last_name,
        email
      });

      res.json({
        status: 'success',
        data: { user }
      });
    } catch (error) {
      if (error.message === 'Email already in use' || error.message === 'User not found') {
        return res.status(400).json({
          status: 'error',
          message: error.message
        });
      }
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
