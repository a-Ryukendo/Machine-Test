

const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
  console.log('Auth middleware - Request headers:', req.headers);
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted:', token ? 'Token exists' : 'No token');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded successfully');

      req.user = await User.findById(decoded.id).select('-password');
      console.log('User found:', req.user ? 'User exists' : 'No user');

      if (!req.user) {
        res.status(401); 
        throw new Error('Not authorized, user not found');
      }

      console.log('Auth middleware - proceeding to next middleware');
      next(); 
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(401); 
      throw new Error('Not authorized, token failed');
    }
  } else {
    console.log('No authorization header found');
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); 
      throw new Error('Not authorized to access this route. Insufficient role.');
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };