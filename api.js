const express = require('express');
const db = require('./db');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { Readable} = require('stream');
const router = express.Router();

const userController = require('./user_Controller');

router.post('/api/signUp', function(req, res) {
  userController.signUp(req, res); 
});

router.post('/api/login', function(req, res) {
  userController.login(req, res); 
});


// Retrieve 
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

// Upload 
router.post('/videos', upload.single('video'), async (req, res) => {
  try {
    const { title, author, category } = req.body;
    const videoFile = req.file.buffer; 

    const filename = uuidv4(); 

    const query = 'INSERT INTO videos (filename, title, author, category, data) VALUES ($1, $2, $3, $4, $5)';
    const values = [filename, title, author, category, videoFile];
    await db.query(query, values);

    res.json({ message: 'Video uploaded successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error uploading video' });
  }
});

// Retrieve 
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
    const videoStream = new Readable();
    videoStream.push(videoFile);
    videoStream.push(null);

    res.setHeader('Content-Type', 'video/mp4');
    videoStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error retrieving video' });
  }
});

module.exports = router;