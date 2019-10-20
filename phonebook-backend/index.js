require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))

app.use(cors())

app.use(bodyParser.json())


morgan.token(
  'body', 
  function (req, res) { 
    if (req.method === 'POST'){
      return JSON.stringify(req.body)
    }
  })

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
  )



app.get('/api/persons', (request, response) => {
  Person.find({}).then(people => {
    response.json(people.map(person => person.toJSON()))
  })
})



app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {    
    response.json(person)  
  } else {    
    response.status(404).end()  
  }
})



app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})



const generateId = () => {
  let maxId = persons.length > 0
    ? Math.max(...persons.map(p => p.id))
    : 0
  maxId++
  return Math.floor(Math.random() * (9999999 - maxId + 1)) + maxId;
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name is missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number is missing' 
    })
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }


  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})



app.get('/info', (req, res) => {
  res.end(
    `Phonebook has info for ${persons.length} people\n` + 
    new Date()
  )
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
