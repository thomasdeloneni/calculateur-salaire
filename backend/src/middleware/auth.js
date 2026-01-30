/**
 * AuthMiddleware - JWT authentication middleware
 */
const TokenService = require('../services/TokenService');

const tokenService = new TokenService();

/**
 * Verify JWT token from Authorization header
 */
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: 'error',
      message: 'No authorization header'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid authorization header format. Use: Bearer <token>'
    });
  }

  const token = parts[1];
  const decoded = tokenService.verify(token);

  if (!decoded) {
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or expired token'
    });
  }

  req.user = {
    id: decoded.userId,
    email: decoded.email
  };

  next();
};

/**
 * Optional authentication - continues even if no token
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next();
  }

  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    const token = parts[1];
    const decoded = tokenService.verify(token);
    if (decoded) {
      req.user = {
        id: decoded.userId,
        email: decoded.email
      };
    }
  }

  next();
};

module.exports = {
  authenticate,
  optionalAuth
};
