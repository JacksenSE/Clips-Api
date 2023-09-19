const express = require('express');
const db = require('./db');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Retrieve all videos endpoint
router.get('/videos', async (req, res) => {
  try {
    const query = 'SELECT filename, title, author, category FROM videos';
    const result = await db.query(query);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error retrieving videos' });
  }
});

const upload = multer();

// Upload video endpoint
router.post('/videos', upload.single('video'), async (req, res) => {
  try {
    const { title, author, category } = req.body;
    const videoFile = req.file.buffer; // Access the uploaded file's binary data

    const filename = uuidv4(); // Generate a unique filename using UUIDv4

    const query = 'INSERT INTO videos (filename, title, author, category, data) VALUES ($1, $2, $3, $4, $5)';
    const values = [filename, title, author, category, videoFile];
    await db.query(query, values);

    res.json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error uploading video' });
  }
});

// Retrieve individual video endpoint
router.get('/videos/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const query = 'SELECT data FROM videos WHERE filename = $1';
    const result = await db.query(query, [filename]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Video not found' });
      return;
    }

    const videoFile = result.rows[0].data;
    res.setHeader('Content-Type', 'video/mp4');
    res.send(videoFile);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error retrieving video' });
  }
});

module.exports = router;