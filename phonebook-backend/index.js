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
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
    })
})



app.post('/api/persons', (request, response) => {
  const body = request.body

  if (body.name === undefined || body.number == undefined) {
    return response.status(400).json({ error: 'name or number is missing' })
  }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
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
