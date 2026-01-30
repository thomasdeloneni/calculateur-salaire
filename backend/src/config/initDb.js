/**
 * Database initialization script
 * Single Responsibility: Only initializes database tables
 */
const pool = require('./database');

const initDatabase = async () => {
  const connection = await pool.getConnection();
  
  try {
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Users table created');

    // Create user_config table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS user_config (
        user_id INT PRIMARY KEY,
        days_per_month DECIMAL(10, 2) DEFAULT 4.22,
        hours_per_day DECIMAL(10, 2) DEFAULT 8.0,
        expense_per_day DECIMAL(10, 2) DEFAULT 3.69,
        salary_multiplier DECIMAL(10, 2) DEFAULT 9.5,
        expense_multiplier DECIMAL(10, 2) DEFAULT 1.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ User config table created');

    // Create calculations table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS calculations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        input_days DECIMAL(10, 2) NOT NULL,
        input_expense_days DECIMAL(10, 2) DEFAULT 0,
        hours_total DECIMAL(10, 2) NOT NULL,
        salary_total DECIMAL(10, 2) NOT NULL,
        expense_total DECIMAL(10, 2) NOT NULL,
        grand_total DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_created_at (created_at)
      )
    `);
    console.log('✓ Calculations table created');

    console.log('\n✅ Database initialization complete');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  } finally {
    connection.release();
  }
};

module.exports = initDatabase;

// Run if called directly
if (require.main === module) {
  initDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
