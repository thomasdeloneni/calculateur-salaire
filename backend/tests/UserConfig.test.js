/**
 * Unit tests for UserConfig model
 */
const UserConfig = require('../src/models/UserConfig');

describe('UserConfig', () => {
  describe('fromRow', () => {
    it('should create UserConfig from database row', () => {
      const row = {
        user_id: 1,
        days_per_month: '4.22',
        hours_per_day: '8.0',
        expense_per_day: '3.69',
        salary_multiplier: '9.5',
        expense_multiplier: '1.0',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02')
      };
      
      const config = UserConfig.fromRow(row);
      
      expect(config.user_id).toBe(1);
      expect(config.days_per_month).toBe(4.22);
      expect(config.hours_per_day).toBe(8.0);
      expect(config.expense_per_day).toBe(3.69);
      expect(config.salary_multiplier).toBe(9.5);
      expect(config.expense_multiplier).toBe(1.0);
    });

    it('should parse string values to floats', () => {
      const row = {
        user_id: 1,
        days_per_month: '4.22',
        hours_per_day: '7.5',
        expense_per_day: '5.0',
        salary_multiplier: '10.0',
        expense_multiplier: '1.2'
      };
      
      const config = UserConfig.fromRow(row);
      
      expect(typeof config.days_per_month).toBe('number');
      expect(typeof config.hours_per_day).toBe('number');
      expect(config.days_per_month).toBe(4.22);
    });
  });

  describe('toJSON', () => {
    it('should convert to plain object', () => {
      const config = new UserConfig(
        1,
        4.22,
        8.0,
        3.69,
        9.5,
        1.0,
        new Date('2024-01-01'),
        new Date('2024-01-02')
      );
      
      const json = config.toJSON();
      
      expect(json).toEqual({
        days_per_month: 4.22,
        hours_per_day: 8.0,
        expense_per_day: 3.69,
        salary_multiplier: 9.5,
        expense_multiplier: 1.0
      });
    });
  });

  describe('constructor with defaults', () => {
    it('should use default values when not provided', () => {
      const config = new UserConfig(1);
      
      expect(config.user_id).toBe(1);
      expect(config.days_per_month).toBe(4.22);
      expect(config.hours_per_day).toBe(8.0);
      expect(config.expense_per_day).toBe(3.69);
      expect(config.salary_multiplier).toBe(9.5);
      expect(config.expense_multiplier).toBe(1.0);
    });
  });
});
