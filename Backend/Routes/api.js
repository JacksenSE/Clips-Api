const bcrypt = require('bcrypt')
const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../../db');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../../models');

const router = express.Router();
const upload = multer();

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
  [
    body('title').notEmpty(),
    body('category').notEmpty(),
  ],
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
  [
    body('username').notEmpty(),
    body('email').isEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

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
