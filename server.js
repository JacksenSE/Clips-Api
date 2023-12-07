const express = require('express');
const cors = require('cors');
const apiRouter = require('./api');
const path = require('path');

const app = express();
const port = 4005; 


app.use(cors());

app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});