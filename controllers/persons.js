const personsRouter = require('express').Router()
const Contact = require('../models/contact');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substr(7);
    }
    return null;
}

personsRouter.get('/' , async(request, response) => {
    const allPersons = await Contact.find({}).populate('user', {username : 1, name: 1})
    response.json(allPersons);
});


personsRouter.get('/:id', async(request, response, next) => {
        const personToView = await Contact.findById(request.params.id);
        if(personToView) {
            response.status(200).json(personToView);
        } else {
            response.status(404).end();
        }
});


personsRouter.delete('/:id', async(request, response) => {
        await Contact.findByIdAndRemove(request.params.id)
        response.status(204).end()
    
});


personsRouter.put('/:id', async(request, response, next) => {
    const {name, number} = request.body;
    const updatedPerson = await Contact.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators : true, context: true})
    response.json(updatedPerson);
});


personsRouter.post('/', async(request, response,next) => {
    const body = request.body;
    const token = getTokenFrom(request);
    const decodedToken = jwt.verify(token, process.env.SECRET);
    if(!decodedToken) {
        return response.status(401).json({error : "token missing or invalid"});
    }
    const user = await User.findById(decodedToken.id)
    const person = new Contact({
        name : body.name,
        number : body.number,
        user : user._id
    });
        const savedPerson = await person.save()
        user.notes = user.notes.concat(savedPerson._id)
        await user.save();
        response.status(201).json(savedPerson);
});


module.exports = personsRouter;