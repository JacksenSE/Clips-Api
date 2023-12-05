// controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userService = require('./user.Service.js');

// Function to authenticate a user
exports.authenticateUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Use the reusable function to find a user by email
    const user = await userService.findUserByEmail(email);

    if (!user) {
      return res.status(404).json({
        message: `Could not find a user with the provided email`,
      });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: `Invalid password`,
      });
    }

    // If authentication is successful, generate a JWT token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    // Send the user and token in the response
    res.json({ user, token });
  } catch (error) {
    // Handle server error
    res.status(500).json({
      message: `Server error: ${error.message}`,
    });
  }
};
