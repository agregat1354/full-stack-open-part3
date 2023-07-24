require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const Person = require('./models/person')

const generateId = () => Math.floor(Math.random() * 13374201354)

let persons = [
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

app.get('/api/persons', (request, response) => {
    Person.find({}).then(allPersons => response.json(allPersons))
})

app.get('/info', (request, response, next) => {
    Person.count({}).then(count => {
        const content = `<p>phonebook has info for ${count} people</p><p>${new Date()}</p>`
        response.send(content)
    }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(result => response.json(result))
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => response.status(204).end())
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ "error": 'missing name or/and number' })
    }

    const newPerson = new Person({
        name: body.name,
        number: body.number
    })

    newPerson.save()
        .then(savedPerson => response.json(savedPerson))
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true, runValidators: true })
        .then(result => response.json(result))
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.log(error)

    if (error.name === 'CastError') {
        response.status(400).send({ error: "Malformed id" })
    } else if (error.name === 'ValidationError') {
        response.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))