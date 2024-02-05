// apiRouter.js
const express = require('express');
const profileRouter = express.Router();
const { authenticateToken } = require('./middleware'); // Create middleware for authenticating tokens
const { User } = require('./models');
// Fetch user profile data
profileRouter.get('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    // Fetch user data based on userId (you might want to validate the userId)
    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile data
profileRouter.put('/profile', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    // Update user data based on userId
    // Make sure to validate and sanitize the input
    await User.update(req.body, { where: { id: userId } });
    res.json({ message: 'User profile updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = profileRouter;