const express = require('express');
// require('dotenv').config();
const app = express();
app.use(express.json());
const cors = require('cors');
app.use(cors());
const Contact = require('./models/contact');
let morgan = require('morgan');
function customMorganFormat(tokens, req, res) {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens['response-time'](req, res), 'ms',
        JSON.stringify(req.body),
        
    ].join(' ');
}
app.use(morgan(customMorganFormat));

// Cors : Cross Origin Resource Sharing


app.get('/', function(request,response) {
    return response.send('<h1>Hello World</h1>');
});

app.get('/api/persons' , (request, response) => {
    return Contact.find({}).then(result => {
        response.json(result);
    });
});


app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id).then(contact => {
        if(contact) {
            return response.json(contact);
        } else {
            return response.status(404).end();
        }
    }).catch(error => next(error));
});
app.delete('/api/persons/:id', (request, response, next) => {
    return Contact.findByIdAndRemove(request.params.id).then(() => {
        response.status(204).end();
    }).catch(error => next(error));
});
app.put('/api/persons/:id', (request, response, next) => {
    const {name, number} = request.body;
   
    return Contact.findByIdAndUpdate(request.params.id, {name, number}, { new: true, runValidators : true, context: true}).then(result => {
        response.json(result);
    }).catch(error => next(error));
});
const errorHandler = (error, req, res, next) => {
    if(error.name === 'CastError') {
        return res.status(400).send({error : error.message});
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({
            error : error.message
        });
    }
    next(error);
};


app.post('/api/persons', (request, response,next) => {
    const body = request.body;
    const person = new Contact({
        name : body.name,
        number : body.number
    });
    return person.save().then(result => {
        response.json(result);
    }).catch(error => next(error));
});

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);
app.use(errorHandler);


const port = process?.env.PORT || 3001;

app.listen(port, () => {
    console.info('server is running on port '+ port);
});