const express = require('express');
const cors = require('cors');
const apiRouter = require('./Backend/Routes/api.js');
const authRouter = require('./Backend/Routes/authRouter.js');
const userRouter = require('./Backend/Routes/userRouter.js');
const path = require('path');

const app = express();
const port = 4005;

require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

