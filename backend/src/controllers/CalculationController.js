/**
 * CalculationController - HTTP request handler for calculations
 * Single Responsibility: Only handles calculation HTTP requests
 * Dependency Injection: Receives service via constructor
 */
class CalculationController {
  /**
   * @param {CalculationService} calculationService
   */
  constructor(calculationService) {
    this.calculationService = calculationService;
  }

  /**
   * POST /calculate
   * @param {Request} req
   * @param {Response} res
   */
  async calculate(req, res) {
    try {
      const result = await this.calculationService.calculate(req.userId, req.body);
      res.json(result);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }

  /**
   * GET /calculate
   * @param {Request} req
   * @param {Response} res
   */
  async getHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const history = await this.calculationService.getHistory(req.userId, limit);
      res.json(history);
    } catch (error) {
      const statusCode = error.statusCode || 500;
      res.status(statusCode).json({ error: error.message });
    }
  }
}

module.exports = CalculationController;
