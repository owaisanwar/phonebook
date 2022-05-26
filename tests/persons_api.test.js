const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Contact = require('../models/contact');
const helper = require('./test_helper');
const api = supertest(app);

const jwt = require('jsonwebtoken');
const User = require('../models/user');

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startWith('bearer ')) {
        return authorization.substr(7)
    }
    return null
}
const {initialPersons, personsInDb} = helper;
beforeEach(async() => {
    await Contact.deleteMany({});
    for(let person of initialPersons) {
    let personObject = new Contact(person)
    await personObject.save();
    }
})

test('persons are returned as json', async() => {
    console.log('entered tests');
    await api.get('/api/persons')
    .expect(200)
    .expect('Content-Type', /application\/json/)
},100000)

test('all persons are returned', async() => {
    const response = await api.get('/api/persons');
    expect(response.body).toHaveLength(initialPersons.length);
})

test('a specific person is within the returned persons', async() => {
    const response = await api.get('/api/persons');
    const contacts = response.body.map(r => r.name);
    expect(contacts).toContain('Hamza');
})

test('a valid person can be added', async() => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im93YWlzYW53YXIiLCJpZCI6IjYyOGY4YTA4OTlkM2I1NmE0MTY4M2Y2NCIsImlhdCI6MTY1MzU3NDE3Mn0.o4OnEcm05hGx5qQQDPe9Hg_bCawO97baqQsvzQNSgLs';
    const decodedToken = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decodedToken.id)

    const newPerson = {
        name: 'Anas Raza',
        number : '+92 3403222311',
        user : user._id
    }
    const res = await api.post('/api/persons').send(newPerson).expect(201).expect('Content-Type', /application\/json/)
    const response = await personsInDb();
    const names = response.map(r => r.name);
    expect(response).toHaveLength(initialPersons.length + 1)
    expect(names).toContain('Anas Raza');

})

test('a person without name cannot be saves', async () => {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im93YWlzYW53YXIiLCJpZCI6IjYyOGY4YTA4OTlkM2I1NmE0MTY4M2Y2NCIsImlhdCI6MTY1MzU3NDE3Mn0.o4OnEcm05hGx5qQQDPe9Hg_bCawO97baqQsvzQNSgLs';
    
    const decodedToken = jwt.verify(token, process.env.SECRET);
    console.log("🚀 ~ file: persons_api.test.js ~ line 71 ~ test ~ decodedToken", decodedToken)
    
    const user = await User.findById(decodedToken.id);

    const personWithoutName = {
        number : "938493849",
        user : user._id
    }
    console.log("🚀 ~ file: persons_api.test.js ~ line 77 ~ test ~ personWithoutName", personWithoutName)
    const res = api.post('/api/persons').send(personWithoutName).expect(400)
    const response = await personsInDb();
    expect(response).toHaveLength(initialPersons.length);
})

test('a specific person can be viewed', async() => {
    const personToView = await personsInDb();
    const person = personToView[0];
    const res = await api.get(`/api/persons/${person.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
    const processedPerson = JSON.parse(JSON.stringify(person))
    expect(res.body).toEqual(processedPerson);
})

test('a person can be deleted', async () => {
    const personsAtStart = await personsInDb();
    const personToDelete = personsAtStart[0];
    await api.delete('/api/persons/'+personToDelete.id).expect(204)

    const personsAtEnd = await personsInDb();
    expect(personsAtEnd).toHaveLength(initialPersons.length - 1);
    const names = personsAtEnd.map(n => n.name);
    expect(names).not.toContain(personToDelete.name);
})


afterAll(() => {
    mongoose.connection.close();
})