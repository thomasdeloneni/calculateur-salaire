/**
 * CalculatorController - Calculator HTTP handlers
 */
const CalculatorService = require('../services/CalculatorService');
const HistoryService = require('../services/HistoryService');
const ConfigService = require('../services/ConfigService');
const SalaryInputDTO = require('../dto/SalaryInputDTO');

class CalculatorController {
  constructor() {
    this.calculatorService = new CalculatorService();
    this.historyService = new HistoryService();
    this.configService = new ConfigService();
  }

  /**
   * POST /api/calculator/calculate
   * Calculate salary (preview - no save)
   */
  async calculate(req, res) {
    try {
      const dto = new SalaryInputDTO(req.body.days_presence, req.body.days_expense);

      const validation = dto.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const result = this.calculatorService.calculate({
        days_presence: dto.days_presence,
        days_expense: dto.days_expense
      });

      res.json({
        status: 'success',
        data: result.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * POST /api/calculator/save
   * Calculate and save to history (requires auth)
   */
  async save(req, res) {
    try {
      const dto = new SalaryInputDTO(req.body.days_presence, req.body.days_expense);

      const validation = dto.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      // Get user config
      const config = await this.configService.getConfig(req.user.id);

      // Calculate and save
      const result = await this.historyService.saveCalculation(
        req.user.id,
        {
          days_presence: dto.days_presence,
          days_expense: dto.days_expense
        },
        config
      );

      res.status(201).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  /**
   * GET /api/calculator/preview
   * Quick preview with default values
   */
  async preview(req, res) {
    try {
      const { days_presence, days_expense } = req.query;

      const daysPres = days_presence ? parseFloat(days_presence) : 0;
      const daysExp = days_expense ? parseFloat(days_expense) : 0;

      if (isNaN(daysPres) || daysPres < 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Invalid days_presence value'
        });
      }

      const result = this.calculatorService.previewCalculate(daysPres, daysExp);

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = CalculatorController;
