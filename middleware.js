// middleware.js
const jwt = require('jsonwebtoken');
const { User } = require('./models'); // Assuming you have a User model

// Middleware function to authenticate tokens
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Assuming you have a User model and want to attach the user to the request
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    // Attach the user to the request for further use
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(403).json({ error: 'Forbidden: Invalid token' });
  }
};

module.exports = {
  authenticateToken,
};