/**
 * HistoryController - History HTTP handlers
 */
const HistoryService = require('../services/HistoryService');

class HistoryController {
  constructor() {
    this.historyService = new HistoryService();
  }

  /**
   * GET /api/history
   * Get calculation history
   */
  async getHistory(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 50;
      const offset = parseInt(req.query.offset) || 0;

      const calculations = await this.historyService.getHistory(req.user.id, {
        limit,
        offset
      });

      res.json({
        status: 'success',
        data: {
          calculations,
          pagination: {
            limit,
            offset,
            count: calculations.length
          }
        }
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
   * GET /api/history/:id
   * Get a single calculation
   */
  async getCalculation(req, res) {
    try {
      const calculation = await this.historyService.getCalculation(
        req.params.id,
        req.user.id
      );

      res.json({
        status: 'success',
        data: { calculation }
      });
    } catch (error) {
      if (error.message === 'Calculation not found' || error.message === 'Not authorized to view this calculation') {
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
   * DELETE /api/history/:id
   * Delete a calculation
   */
  async deleteCalculation(req, res) {
    try {
      const deleted = await this.historyService.deleteCalculation(
        req.params.id,
        req.user.id
      );

      if (!deleted) {
        return res.status(404).json({
          status: 'error',
          message: 'Calculation not found'
        });
      }

      res.json({
        status: 'success',
        message: 'Calculation deleted'
      });
    } catch (error) {
      if (error.message === 'Calculation not found' || error.message === 'Not authorized to delete this calculation') {
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
   * DELETE /api/history
   * Clear all history
   */
  async clearHistory(req, res) {
    try {
      const count = await this.historyService.clearHistory(req.user.id);

      res.json({
        status: 'success',
        message: `Deleted ${count} calculations`
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

module.exports = HistoryController;
