/**
 * AuthMiddleware - JWT authentication middleware
 * Single Responsibility: Only handles JWT validation
 */
const ITokenService = require('../interfaces/ITokenService');

class AuthMiddleware {
  /**
   * @param {ITokenService} tokenService
   */
  constructor(tokenService) {
    this.tokenService = tokenService;
  }

  /**
   * Verify JWT token and attach user to request
   * @param {Request} req
   * @param {Response} res
   * @param {Function} next
   */
  authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
      return res.status(401).json({ error: 'Token error' });
    }
    
    const [scheme, token] = parts;
    
    if (!/^Bearer$/i.test(scheme)) {
      return res.status(401).json({ error: 'Token malformed' });
    }
    
    const decoded = this.tokenService.verify(token);
    
    if (!decoded) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  }
}

module.exports = AuthMiddleware;
