const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header('x-auth-token');

  if (token) {
    try {
      // Try to verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // If valid, attach the decoded user info to the request
      req.user = decoded.user;
    } catch (err) {
      // If the token is invalid, log the error and continue without blocking access
      console.error('Optional auth: Invalid token, proceeding as guest.');
    }
  }
  // Continue to the next middleware/route regardless of token presence
  next();
};
