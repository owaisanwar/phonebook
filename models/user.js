const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username : String,
    name: String,
    passwordHash: String,
    notes : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : 'PhoneBook'
        }
    ]
})

userSchema.set('toJSON', {
    transform : (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();

        delete returnedObject.__v;
        delete returnedObject._id;
        delete returnedObject.passwordHash;
    }
})

const User = new mongoose.model('User', userSchema);
module.exports = User