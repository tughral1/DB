const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    console.log('Authorization Header:', req.header('Authorization'));
    const token = req.header('Authorization').replace('Bearer ', '');
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and attach to request
    const user = await User.findByPk(decoded.user_id);
    if (!user) throw new Error('User not found');

    req.user = user; // Attach user to request object
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message); 
    res.status(401).json({ error: 'Authentication required' });
  }
};

// Role-based access control (e.g., allow only sellers/agents)
const authorizeRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    next();
  };
};

module.exports = { authenticate, authorizeRole };