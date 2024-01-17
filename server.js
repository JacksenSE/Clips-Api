const fs = require('fs');
const express = require('express');
const cors = require('cors');
const apiRouter = require('./api');
const path = require('path');

const app = express();
const port = 4005;

require('dotenv').config();
app.use(cors());

// Define API routes
app.use('/api', apiRouter);

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

const filePath = path.join(__dirname, 'dist', 'website.html');
console.log('File path:', filePath);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
