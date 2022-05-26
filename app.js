const config = require('./utils/config')
const express = require('express');
require('express-async-errors')
const app = express();
const personsRouter = require('./controllers/persons');
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const cors = require('cors');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');

logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI)
    .then(() => {
    logger.info('connected to MongoDB')
})
    .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
})
app.use(cors());
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/persons', personsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app