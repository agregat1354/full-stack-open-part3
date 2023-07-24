const mongoose = require('mongoose')


mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log("connecting to mongodb")

mongoose.connect(url)
    .then(() => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        validate: (v) => {
            return /^\d{2,3}-\d+$/.test(v) && v.length >= 9
        },
        message: () => "Phone number must follow following pattern: 2-3 digits followed by hyphen and more digits, there also must be at least 8 numbers"
    }
})

personSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = doc._id.toString()
        delete ret._id
        delete ret.__v
    }
})

const Person = new mongoose.model('Person', personSchema)

module.exports = Person