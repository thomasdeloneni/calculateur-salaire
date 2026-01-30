/**
 * Dependency Injection Container
 * Single Responsibility: Only manages dependency injection
 * Open/Closed: New dependencies can be added without modification
 */
class DIContainer {
  constructor() {
    this.services = new Map();
  }

  /**
   * Register a service
   * @param {string} name
   * @param {Object} service
   * @returns {DIContainer}
   */
  register(name, service) {
    this.services.set(name, service);
    return this;
  }

  /**
   * Get a service
   * @param {string} name
   * @returns {Object}
   */
  get(name) {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }

  /**
   * Check if a service exists
   * @param {string} name
   * @returns {boolean}
   */
  has(name) {
    return this.services.has(name);
  }
}

module.exports = DIContainer;
