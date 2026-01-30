/**
 * Service Factory - Creates and configures all dependencies
 * Single Responsibility: Only creates and wires dependencies
 * Dependency Injection: Uses DIContainer for dependency management
 */
const DIContainer = require('../utils/DIContainer');
const pool = require('../config/database');

// Repositories
const UserRepository = require('../repositories/UserRepository');
const ConfigRepository = require('../repositories/ConfigRepository');
const CalculationRepository = require('../repositories/CalculationRepository');

// Services
const PasswordHasher = require('../services/PasswordHasher');
const TokenService = require('../services/TokenService');
const SalaryCalculator = require('../services/SalaryCalculator');
const AuthService = require('../services/AuthService');
const ConfigService = require('../services/ConfigService');
const CalculationService = require('../services/CalculationService');

// Controllers
const AuthController = require('../controllers/AuthController');
const ConfigController = require('../controllers/ConfigController');
const CalculationController = require('../controllers/CalculationController');

// Middleware
const AuthMiddleware = require('../middleware/AuthMiddleware');

/**
 * Create and configure the dependency injection container
 * @returns {DIContainer}
 */
function createContainer() {
  const container = new DIContainer();

  // Database (singleton)
  container.register('dbPool', pool);

  // Repositories (singleton)
  container.register('userRepository', new UserRepository(pool));
  container.register('configRepository', new ConfigRepository(pool));
  container.register('calculationRepository', new CalculationRepository(pool));

  // Services (singleton)
  container.register('passwordHasher', new PasswordHasher());
  container.register('tokenService', new TokenService());
  container.register('salaryCalculator', new SalaryCalculator());

  // Business Services (singleton)
  container.register('authService', new AuthService(
    container.get('userRepository'),
    container.get('passwordHasher'),
    container.get('tokenService')
  ));

  container.register('configService', new ConfigService(
    container.get('configRepository')
  ));

  container.register('calculationService', new CalculationService(
    container.get('configRepository'),
    container.get('calculationRepository'),
    container.get('salaryCalculator')
  ));

  // Controllers (singleton)
  container.register('authController', new AuthController(
    container.get('authService')
  ));

  container.register('configController', new ConfigController(
    container.get('configService')
  ));

  container.register('calculationController', new CalculationController(
    container.get('calculationService')
  ));

  // Middleware (singleton)
  container.register('authMiddleware', new AuthMiddleware(
    container.get('tokenService')
  ));

  return container;
}

module.exports = { createContainer, DIContainer };
