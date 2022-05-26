const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('notes', {name : 1, number : 1})
    response.json(users)
  })

usersRouter.post('/', async(req, res) => {
    const {name, username, password} = req.body;

    const existingUser = await User.findOne({username})
    if(existingUser) {
        return res.status(400).json({
            error : 'username must be unique'
        })
    }
    const saltRound = 10;
    const passwordHash = await bcrypt.hash(password, saltRound)
    let newUser = new User({
        name,
        username,
        passwordHash
    })
    const savedUser = await newUser.save();
    res.status(201).json(savedUser)
})




module.exports = usersRouter