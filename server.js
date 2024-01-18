const fs = require('fs');
const express = require('express');
const cors = require('cors');
const apiRouter = require('./api');
const signupRouter = require('./user_Controller');
const loginRouter = require('./user_Controller');
const path = require('path');

const app = express();
const port = 4005;


require('dotenv').config();
app.use(cors());

// Define API routes
app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

const filePath = path.join(__dirname, 'dist', 'index.html');
console.log('File path:', filePath);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
