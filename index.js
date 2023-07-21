const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
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
    response.json(persons)
})

app.get('/info', (request, response) => {
    const content = `<p>phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    response.send(content)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (!person) {
        return response.status(404).end()
    }

    return response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    console.log(persons)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({ "error": 'missing name or/and number' })
    }

    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ error: "name must be unique" })
    }

    const newPerson = {
        id: generateId(),
        name: body.name,
        number: body.number
    }


    persons = [...persons, newPerson]
    console.log(persons)
    response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))