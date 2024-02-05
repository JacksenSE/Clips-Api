const bcrypt = require('bcrypt');
const users = require('express').Router();
const db = require('./models');

const { User } = db;

// Get all users
users.get('/login/', async (req, res) => {
    try {
        const foundUsers = await User.findAll();
        res.status(200).json(foundUsers);
    } catch (err) {
        res.status(500).json('Server error');
        console.log(err);
    }
});

// Get a user by id
users.get('/login/:id', async (req, res) => {
    try {
        const foundUser = await User.findOne({
            where: { id: req.params.id },
        });
        res.status(200).json(foundUser);
    } catch (err) {
        res.status(500).send("Server error");
        console.log(err);
    }
});

// Create a new user
users.post('/', async (req, res) => {
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

// Update a user by id
users.put('/login/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { username, bio, profile_picture } = req.body;

        const updatedUser = await User.update(
            { username, bio, profile_picture },
            { where: { id } }
        );

        res.status(200).json({
            message: `User ${id} updated successfully`,
        });
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json("Server error");
    }
});

// Delete user by id
users.delete('/login/:id', async (req, res) => {
    try {
        const deletedUser = await User.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({
            message: `User ${req.params.id} deleted successfully`,
        });
    } catch (err) {
        res.status(500).json("Server error");
        console.log(err);
    }
});

module.exports = users;