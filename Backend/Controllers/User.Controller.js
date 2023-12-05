//User.controllers.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');

// Function to get all users
exports.getAllUsers = async (req, res) => {
    try {
        const foundUsers = await User.findAll();
        res.status(200).json(foundUsers);
    } catch (err) {
        res.status(500).json('Server error');
        console.error(err);
    }
};

// Function to get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const foundUser = await User.findOne({
            where: { id: req.params.id },
        });
        res.status(200).json(foundUser);
    } catch (err) {
        res.status(500).send('Server error');
        console.error(err);
    }
};

// Function to create a new user
exports.createUser = async (req, res) => {
    try {
        let { password, ...rest } = req.body;
        const user = await User.create({
            ...rest,
            password: await bcrypt.hash(password, 10),
        });
        res.json(user);
    } catch (err) {
        res.status(500).send('Server error');
        console.error(err);
    }
};

// Function to update a user by ID
exports.updateUser = async (req, res) => {
    try {
        const updatedUser = await User.update(req.body, {
            where: { id: req.params.id },
        });
        res.status(200).json({
            message: `User ${req.params.id} updated successfully`,
        });
    } catch (err) {
        res.status(500).json('Server error');
        console.error(err);
    }
};

// Function to delete a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.destroy({
            where: { id: req.params.id },
        });
        res.status(200).json({
            message: `User ${req.params.id} deleted successfully`,
        });
    } catch (err) {
        res.status(500).json('Server error');
        console.error(err);
    }
};

// Function to authenticate a user
exports.authenticate = async (req, res) => {
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

        const token = jwt.sign({ id: user.Id }, process.env.JWT_SECRET);
        res.json({ user: user, token: token });
    } catch (error) {
        res.status(500).json({
            message: `Server error: ${error.message}`,
        });
        console.error(error);
    }
};
