// app.js
const express = require('express');
const cors = require('cors');
const authRouter = require('./auth_Controller'); // Import auth router
const apiRouter = require('./api');
const profileRouter = require('./profileRouter');
const loginRouter = require('./user_Controller')
const pictureRouter = require('./pictureRouter');
const path = require('path');

const app = express();
const port = 4005;

require('dotenv').config();
app.use(cors());
app.use(express.json());
// Define API routes
app.use('/api/', profileRouter)
app.use('/api/', loginRouter)
app.use('/api/', apiRouter);
app.use('/api/', authRouter); 
app.use('/api/', pictureRouter);
app.use('/docs', express.static(path.join(__dirname, 'docs.html')));
// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));
app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ error: 'Unauthorized request' });
  } else {
    next(err);
  }
});

const filePath = path.join(__dirname, 'dist', 'index.html');
console.log('File path:', filePath);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});