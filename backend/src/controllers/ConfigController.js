/**
 * ConfigController - Configuration HTTP handlers
 */
const ConfigService = require('../services/ConfigService');
const UpdateConfigDTO = require('../dto/UpdateConfigDTO');

class ConfigController {
  constructor() {
    this.configService = new ConfigService();
  }

  /**
   * GET /api/config
   * Get user configuration
   */
  async getConfig(req, res) {
    try {
      const config = await this.configService.getConfig(req.user.id);
      res.json({
        status: 'success',
        data: { config }
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
   * PUT /api/config
   * Update user configuration
   */
  async updateConfig(req, res) {
    try {
      const dto = new UpdateConfigDTO(
        req.body.days_per_month,
        req.body.hours_per_day,
        req.body.expense_per_day,
        req.body.salary_multiplier,
        req.body.expense_multiplier
      );

      const validation = dto.validate();
      if (!validation.isValid) {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: validation.errors
        });
      }

      const config = await this.configService.updateConfig(req.user.id, {
        days_per_month: dto.days_per_month,
        hours_per_day: dto.hours_per_day,
        expense_per_day: dto.expense_per_day,
        salary_multiplier: dto.salary_multiplier,
        expense_multiplier: dto.expense_multiplier
      });

      res.json({
        status: 'success',
        data: { config }
      });
    } catch (error) {
      if (error.message.includes('must be')) {
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

  /**
   * DELETE /api/config
   * Reset configuration to defaults
   */
  async resetConfig(req, res) {
    try {
      const config = await this.configService.resetConfig(req.user.id);
      res.json({
        status: 'success',
        data: { config }
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

module.exports = ConfigController;
