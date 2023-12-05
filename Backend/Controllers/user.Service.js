// controllers/userService.js
const { User } = require('../../models');

// Function to find a user by email
exports.findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (error) {
    throw error;
  }
};
