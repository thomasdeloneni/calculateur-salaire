/**
 * Main Express Server
 */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const { initDatabase, testConnection } = require('./config/database');
const { authenticate, optionalAuth } = require('./middleware/auth');

// Controllers
const AuthController = require('./controllers/AuthController');
const CalculatorController = require('./controllers/CalculatorController');
const ConfigController = require('./controllers/ConfigController');
const HistoryController = require('./controllers/HistoryController');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Initialize controllers
const authController = new AuthController();
const calculatorController = new CalculatorController();
const configController = new ConfigController();
const historyController = new HistoryController();

// Public routes
app.post('/api/auth/register', authController.register.bind(authController));
app.post('/api/auth/login', authController.login.bind(authController));
app.get('/api/calculator/preview', optionalAuth, calculatorController.preview.bind(calculatorController));
app.post('/api/calculator/calculate', optionalAuth, calculatorController.calculate.bind(calculatorController));

// Protected routes
app.get('/api/auth/me', authenticate, authController.me.bind(authController));
app.put('/api/auth/profile', authenticate, authController.updateProfile.bind(authController));
app.get('/api/config', authenticate, configController.getConfig.bind(configController));
app.put('/api/config', authenticate, configController.updateConfig.bind(configController));
app.delete('/api/config', authenticate, configController.resetConfig.bind(configController));
app.post('/api/calculator/save', authenticate, calculatorController.save.bind(calculatorController));
app.get('/api/history', authenticate, historyController.getHistory.bind(historyController));
app.get('/api/history/:id', authenticate, historyController.getCalculation.bind(historyController));
app.delete('/api/history/:id', authenticate, historyController.deleteCalculation.bind(historyController));
app.delete('/api/history', authenticate, historyController.clearHistory.bind(historyController));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.log('Warning: Database connection failed. Server will start but database features may not work.');
    } else {
      // Initialize database schema
      await initDatabase();
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
