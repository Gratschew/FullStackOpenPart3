const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://max:${password}@cluster0.iydhe1m.mongodb.net/phoneBook?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
    name: String,
    phoneNumber: String,
})

const PhoneNumber = mongoose.model('Phonebook', phoneNumberSchema)
if (process.argv.length < 4) {
    PhoneNumber.find({}).then((result) => {
        result.forEach((number) => {
            console.log(number)
        })
        mongoose.connection.close()
    })
} else {
    const name = process.argv[3]
    const number = process.argv[4]

    const phoneNumber = new PhoneNumber({
        name: name,
        phoneNumber: number,
    })
    phoneNumber.save().then(() => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
}
