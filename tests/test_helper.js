const Contact = require('../models/contact')
const User = require('../models/user');
const initialPersons = [

        {
            name : 'Owais',
            number : '+92 3408027408'
        },
        {
            name: 'Hamza',
            number : '+92 3484256396'
        }
]

const nonExistingId = async () => {
    const person = new Contact({name : 'Anas Raza', nuumber : '0204829482'})
    await person.save();
    await person.remove();

    return person._id.toString();
}

const personsInDb = async () => {
    const persons = await Contact.find({})
    return persons.map(person => person.toJSON())
}
const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
  }

module.exports = {
    initialPersons, nonExistingId, personsInDb,usersInDb
}