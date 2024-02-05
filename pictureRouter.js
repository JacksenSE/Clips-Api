const express = require('express');
const { User } = require('./models');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const pictureRouter = express.Router();

const storage = multer.memoryStorage(); // Store files in memory as Buffer
const upload = multer({ storage });

// Upload profile picture endpoint a1 
pictureRouter.post('/login/:userId', upload.single('profile_picture'), async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by userId
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Update the profile_picture column in the database with the uploaded file data
    user.profile_picture = req.file.buffer;

    await user.save();

    res.json({ message: 'Profile picture uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error uploading profile picture' });
  }
});

module.exports = pictureRouter;