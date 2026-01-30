/**
 * Unit tests for User model
 */
const User = require('../src/models/User');

describe('User', () => {
  describe('fromRow', () => {
    it('should create User from database row', () => {
      const row = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedpassword',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02')
      };
      
      const user = User.fromRow(row);
      
      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.password_hash).toBe('hashedpassword');
      expect(user.created_at).toEqual(new Date('2024-01-01'));
      expect(user.updated_at).toEqual(new Date('2024-01-02'));
    });

    it('should use current date for created_at and updated_at if not provided', () => {
      const row = {
        id: 1,
        email: 'test@example.com',
        password_hash: 'hashedpassword'
      };
      
      const before = new Date();
      const user = User.fromRow(row);
      const after = new Date();
      
      expect(user.created_at.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.created_at.getTime()).toBeLessThanOrEqual(after.getTime());
      expect(user.updated_at.getTime()).toBeGreaterThanOrEqual(before.getTime());
      expect(user.updated_at.getTime()).toBeLessThanOrEqual(after.getTime());
    });
  });

  describe('toJSON', () => {
    it('should convert to plain object without password_hash', () => {
      const user = new User(
        1,
        'test@example.com',
        'hashedpassword',
        new Date('2024-01-01'),
        new Date('2024-01-02')
      );
      
      const json = user.toJSON();
      
      expect(json).toEqual({
        id: 1,
        email: 'test@example.com',
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-02')
      });
      expect(json.password_hash).toBeUndefined();
    });
  });

  describe('constructor', () => {
    it('should create User with all parameters', () => {
      const user = new User(1, 'test@example.com', 'hash', new Date(), new Date());
      
      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.password_hash).toBe('hash');
    });
  });
});
