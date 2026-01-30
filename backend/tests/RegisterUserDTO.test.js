/**
 * Unit tests for RegisterUserDTO
 * TDD: Write tests first, then implement
 */
const RegisterUserDTO = require('../src/dto/RegisterUserDTO');

describe('RegisterUserDTO', () => {
  describe('validate', () => {
    it('should return valid for correct input', () => {
      const dto = new RegisterUserDTO('test@example.com', 'password123');
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for missing email', () => {
      const dto = new RegisterUserDTO('', 'password123');
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is required');
    });

    it('should return invalid for invalid email format', () => {
      const dto = new RegisterUserDTO('invalid-email', 'password123');
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email is invalid');
    });

    it('should return invalid for missing password', () => {
      const dto = new RegisterUserDTO('test@example.com', '');
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password is required');
    });

    it('should return invalid for short password', () => {
      const dto = new RegisterUserDTO('test@example.com', '12345');
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Password must be at least 6 characters');
    });

    it('should accept valid email with special characters', () => {
      const dto = new RegisterUserDTO('user.name+tag@example.com', 'password123');
      const result = dto.validate();
      
      expect(result.isValid).toBe(true);
    });

    it('should return multiple errors if multiple fields are invalid', () => {
      const dto = new RegisterUserDTO('', '');
      const result = dto.validate();
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid email', () => {
      const dto = new RegisterUserDTO('test@example.com', 'password123');
      expect(dto.isValidEmail('test@example.com')).toBe(true);
    });

    it('should return false for email without @', () => {
      const dto = new RegisterUserDTO('test@example.com', 'password123');
      expect(dto.isValidEmail('testexample.com')).toBe(false);
    });

    it('should return false for email without domain', () => {
      const dto = new RegisterUserDTO('test@example.com', 'password123');
      expect(dto.isValidEmail('test@')).toBe(false);
    });
  });
});
