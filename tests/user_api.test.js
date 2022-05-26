const bcrypt = require('bcrypt');
const app = require('../app')
const supertest = require('supertest')
api = supertest(app);
const User = require('../models/user');
const helper = require('./test_helper');
const { json } = require('express/lib/response');
const { default: mongoose } = require('mongoose');

describe('when there is initially one user in db', () => {
    beforeEach(async() => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('sekret', 10);
        const user = new    User({username : 'root', passwordHash})
        await user.save()
    })

    test('creation succeeds with a fresh username', async() => {
        const userAtStart = await helper.usersInDb()

        const newUser = {
            username : 'owaisanwar',
            name : 'Owais Anwar',
            password : 'owais'
        }

        await api.post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

        const userAtEnd = await helper.usersInDb()
        expect(userAtEnd).toHaveLength(userAtStart.length + 1)

        const username = userAtEnd.map(u => u.username);
        expect(username).toContain(newUser.username);
    })

    test('creation failed with proper status code and message if username is already taken', async () => {
        const usersAtStart = await helper.usersInDb();
        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'salainen',
          }

        const result = await api.post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('username must be unique')

        const usersAtEnd = await helper.usersInDb();
        expect(usersAtEnd).toEqual(usersAtStart)

    })
})

afterAll(() => {
    mongoose.connection.close();
})