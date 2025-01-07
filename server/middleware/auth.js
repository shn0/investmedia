const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Extract token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1];

  // If no token is provided
  if (!token) {
    return res.status(401).json({ message: 'Access Denied: No token provided' });
  }

  try {
    // Verify the token using the secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified; // Add user data (decoded token) to the request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;
