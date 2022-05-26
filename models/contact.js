const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;
mongoose.connect(url).then(result => {
    console.log('connected to database');
}).catch(error => {
    console.log('error connecting to db: ', error.message);
})

const contactSchema = new mongoose.Schema({
    name : {
        type : String,
        minlength : 3,
        required : true
    },
    number : {
        type : String,
        required : true
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})
const Contact = new mongoose.model('PhoneBook', contactSchema);
contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})
module.exports = Contact;