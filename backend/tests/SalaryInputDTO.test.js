/**
 * Unit tests for SalaryInputDTO
 * TDD: Write tests first, then implement
 */
const SalaryInputDTO = require('../src/dto/SalaryInputDTO');

describe('SalaryInputDTO', () => {
  describe('validate', () => {
    it('should return valid for correct input with only days_presence', () => {
      const dto = new SalaryInputDTO(20);
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return valid for correct input with both params', () => {
      const dto = new SalaryInputDTO(20, 15);
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for missing days_presence', () => {
      const dto = new SalaryInputDTO(undefined);
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('days_presence is required');
    });

    it('should return invalid for null days_presence', () => {
      const dto = new SalaryInputDTO(null);
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('days_presence is required');
    });

    it('should return invalid for negative days_presence', () => {
      const dto = new SalaryInputDTO(-5);
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('days_presence must be a non-negative number');
    });

    it('should return invalid for non-numeric days_presence', () => {
      const dto = new SalaryInputDTO('abc');
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('days_presence must be a non-negative number');
    });

    it('should return invalid for negative days_expense', () => {
      const dto = new SalaryInputDTO(20, -5);
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('days_expense must be a non-negative number');
    });

    it('should allow zero for both values', () => {
      const dto = new SalaryInputDTO(0, 0);
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
    });

    it('should allow fractional days', () => {
      const dto = new SalaryInputDTO(4.5, 3.5);
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
    });

    it('should allow null days_expense', () => {
      const dto = new SalaryInputDTO(20, null);
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
    });
  });
});
