const bcrypt = require('bcrypt')
const users = require('express').Router()
const db = require('./models')
const { User } = db

// get all the users
users.get('/signup/users', async (req,res) => {
    try {
        const foundUsers = await User.findAll()
        res.status(200).json(foundUsers)
    } catch (err) {
        res.status(500).json('server error')
        console.log(err)
    }
})
// get a users by id
users.get('/:id', async (req, res) => {
    try {
        const foundUser = await User.findOne({
            where: { id: req.params.id },
        })
        res.status(200).json(foundUser)
    } catch (err) {
        res.status(500).send("Server error")
        console.log(err)
    }
})

// CREATE NEW users
users.post('/signup/users', async (req, res) => {
    console.log("working")
    try{
        let { password, ...rest } = req.body;
        const user = await User.create({
            ...rest,
            password: await bcrypt.hash(password, 10)
        })
        res.json(user)

    } catch (err){
        res.status(500).send('server error')
        console.log(err)
    }
})

// UPDATE A users by id
users.get('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id, 10); 
        const foundUser = await User.findOne({
            where: { id: userId },
        });
        res.status(200).json(foundUser);
    } catch (err) {
        res.status(500).send("Server error");
        console.log(err);
    }
});

// DELETE users BY ID
users.delete('/:id', async (req, res) => {
    try {
        const deletedUser = await User.destroy({
            where: { id: req.params.id }
        })
        res.status(200).json({
            message: `User ${req.params.id} deleted successfully`
        })
    } catch (err) {
        res.status(500).json("server error")
        console.log(err)
    }
})
module.exports = users

