/**
 * Unit tests for UpdateConfigDTO
 * TDD: Write tests first, then implement
 */
const UpdateConfigDTO = require('../src/dto/UpdateConfigDTO');

describe('UpdateConfigDTO', () => {
  describe('validate', () => {
    it('should return valid for empty object (no updates)', () => {
      const dto = new UpdateConfigDTO({});
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid for correct config values', () => {
      const dto = new UpdateConfigDTO({
        days_per_month: 4.22,
        hours_per_day: 8.0,
        expense_per_day: 3.69,
        salary_multiplier: 9.5,
        expense_multiplier: 1.0
      });
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for negative days_per_month', () => {
      const dto = new UpdateConfigDTO({ days_per_month: -5 });
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('days_per_month must be a positive number');
    });

    it('should return invalid for zero days_per_month', () => {
      const dto = new UpdateConfigDTO({ days_per_month: 0 });
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('days_per_month must be a positive number');
    });

    it('should return invalid for negative hours_per_day', () => {
      const dto = new UpdateConfigDTO({ hours_per_day: -7.5 });
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('hours_per_day must be a positive number');
    });

    it('should return invalid for negative expense_per_day', () => {
      const dto = new UpdateConfigDTO({ expense_per_day: -3.69 });
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('expense_per_day must be a non-negative number');
    });

    it('should allow zero expense_per_day', () => {
      const dto = new UpdateConfigDTO({ expense_per_day: 0 });
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for negative salary_multiplier', () => {
      const dto = new UpdateConfigDTO({ salary_multiplier: -9.5 });
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('salary_multiplier must be a positive number');
    });

    it('should return invalid for negative expense_multiplier', () => {
      const dto = new UpdateConfigDTO({ expense_multiplier: -1.0 });
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('expense_multiplier must be a non-negative number');
    });

    it('should allow zero expense_multiplier', () => {
      const dto = new UpdateConfigDTO({ expense_multiplier: 0 });
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for non-numeric values', () => {
      const dto = new UpdateConfigDTO({ days_per_month: 'abc' });
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
    });

    it('should return multiple errors for multiple invalid fields', () => {
      const dto = new UpdateConfigDTO({
        days_per_month: -5,
        hours_per_day: -7,
        salary_multiplier: -10
      });
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(3);
    });
  });
});
