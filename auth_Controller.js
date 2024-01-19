const express = require('express');
const db = require("./models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = db;

const auth = express.Router();

// Signup route
auth.post('/signup/', async (req, res) => {
    try {
        let { password, ...rest } = req.body;
        const user = await User.create({
            ...rest,
            password: await bcrypt.hash(password, 10),
        });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
        console.log(err);
    }
});

// Login route
auth.post('/login/', async (req, res) => {
    try {
        let user = await User.findOne({
            where: { email: req.body.email },
        });

        if (!user) {
            res.status(404).json({
                message: `Could not find a user with the provided email`,
            });
            return;
        }

        const passwordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!passwordMatch) {
            res.status(401).json({
                message: `Invalid password`,
            });
            return;
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);
        res.json({ user: user, token: token });
    } catch (error) {
        res.status(500).json({
            message: `Server error: ${error.message}`,
        });
    }
});

module.exports = auth;