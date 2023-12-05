// routes/authRouter.js
const express = require('express');
const authController = require('../Controllers/auth_Controller');

const authRouter = express.Router();

// Route to authenticate a user
authRouter.post('/authenticate', authController.authenticateUser);

module.exports = authRouter;
