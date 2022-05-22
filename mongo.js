const mongoose = require('mongoose')
if(process.argv.length < 3) {
    console.log("password is not provides");
    process.exit(1);
}
const password = process.argv[2];
const url = `mongodb+srv://owaisanwar:${password}@cluster0.ia30j.mongodb.net/?retryWrites=true&w=majority`
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
    name : String,
    number : String
})

const PhoneBookEntry = new mongoose.model('PhoneBook', contactSchema);
const entryName = process.argv[3];
const entryNumber = process.argv[4];
if(process.argv.length > 3) {

    const entry = new PhoneBookEntry({
        name : entryName,
        number : entryNumber
    })
    
    entry.save().then(result => {
        console.log(`added ${result.name} number ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else {
    PhoneBookEntry.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(entry => {
        console.log(`${entry.name} ${entry.number}`);
        })
        mongoose.connection.close();
    })
}