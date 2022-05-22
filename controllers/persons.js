const personsRouter = require('express').Router()
const { model } = require('mongoose');
const Contact = require('../models/contact');


personsRouter.get('/' , (request, response) => {
    return Contact.find({}).then(result => {
        response.json(result);
    });
});

personsRouter.get('/:id', (request, response, next) => {
    Contact.findById(request.params.id).then(contact => {
        if(contact) {
            return response.json(contact);
        } else {
            return response.status(404).end();
        }
    }).catch(error => next(error));
});


personsRouter.delete('/:id', (request, response, next) => {
    return Contact.findByIdAndRemove(request.params.id).then(() => {
        response.status(204).end();
    }).catch(error => next(error));
});

personsRouter.put('/:id', (request, response, next) => {
    const {name, number} = request.body;
   
    return Contact.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators : true, context: true}).then(result => {
        response.json(result);
    }).catch(error => next(error));
});
personsRouter.post('/', (request, response,next) => {
    const body = request.body;
    const person = new Contact({
        name : body.name,
        number : body.number
    });
    return person.save().then(result => {
        response.json(result);
    }).catch(error => next(error));
});


module.exports = personsRouter;