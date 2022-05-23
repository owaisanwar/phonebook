const personsRouter = require('express').Router()
const Contact = require('../models/contact');


personsRouter.get('/' , async(request, response) => {
    const allPersons = await Contact.find({});
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
    const person = new Contact({
        name : body.name,
        number : body.number
    });
        const savedPerson = await person.save()
        response.status(201).json(savedPerson);
   
});


module.exports = personsRouter;