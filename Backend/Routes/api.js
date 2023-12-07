const bcrypt = require('bcrypt');
const express = require('express');
const db = require('../../db');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../../models');

const router = express.Router();
const upload = multer();

function validateVideoUpload(req, res, next) {
  const { title, category } = req.body;
  const videoFile = req.file;

  if (!title || !category || !videoFile) {
    return res.status(400).json({ error: 'Title, category, and video file are required' });
  }

  next();
}

function validateUserRegistration(req, res, next) {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required' });
  }

  next();
}

router.get('/videos', async (req, res) => {
  try {
    const query = 'SELECT filename, title, category FROM videos';
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error retrieving videos' });
  }
});

router.post(
  '/videos',
  upload.single('video'),
  validateVideoUpload,
  async (req, res) => {
    try {
      const { title, category } = req.body;
      const videoFile = req.file.buffer; // Access the uploaded file's binary data

      const filename = uuidv4(); // Generate a unique filename using UUIDv4

      const query =
        'INSERT INTO videos (filename, title, category, data) VALUES ($1, $2, $3, $4)';
      const values = [filename, title, category, videoFile];
      await db.query(query, values);

      res.json({ message: 'Video uploaded successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error uploading video' });
    }
  }
);

router.post(
  '/register',
  validateUserRegistration,
  async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if the user with the given email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
      });

      res.json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error registering user' });
    }
  }
);

module.exports = router;
