const express = require('express');
require('dotenv').config();
const app = express();
app.use(express.json())
const cors = require('cors');
app.use(cors())
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
app.use(morgan(customMorganFormat))
// Cors : Cross Origin Resource Sharing
let phoneBookEntries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]
function generateId() {
    const id = phoneBookEntries.length;
    console.log("🚀 ~ file: index.js ~ line 66 ~ generateId ~ id", id)
    return id + 1
}


app.get('/', function(request,response) {
    return response.send('<h1>Hello World</h1>')
})

app.get('/api/persons' , (request, response) => {
    return response.status(200).json(phoneBookEntries);
})

app.get('/info', (request, response) => {
    response.send('<p>Phonebook has info for ' + phoneBookEntries.length + ' people\</p>' + new Date())
    
})

app.get('/api/persons/:id', (request, response) => {
    const id = +request.params.id;
    const person = phoneBookEntries.find(item => item.id === id)
    if(person) {
        return response.json(person).status(200);
    } else return response.status(404).end('<h1>Person not found</h1>');
})

app.delete('/api/persons/:id', (request, response) => {
    const id = +request.params.id;
    phoneBookEntries = phoneBookEntries.filter(item => item.id !== id);
    return response.status(204).end();
})

app.post('/api/persons', (request, response) => {
    const body = request.body;
    body.id = generateId();
    // console.log("🚀 ~ file: index.js ~ line 57 ~ app.post ~ body", body)
    const findEntry = phoneBookEntries.find(entry => entry.name === body.name)
    if(findEntry) {
        return response.status(404).json({
            'error' : 'name must be unique'
        })
    } else {
        phoneBookEntries = phoneBookEntries.concat(body)
        return response.status(200).json({
            'success' : true,
            'message' : 'entry added successfully'
        })
    }
}) 

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint);


const port = process.env.PORT || 3001
console.log("🚀 ~ file: index.js ~ line 37 ~ port", port)

app.listen(port, () => {
    console.info('server is running on port '+ port);
})