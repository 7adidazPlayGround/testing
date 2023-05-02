const express = require('express');
var dexter = require('morgan');
const app = express();
const cors = require('cors');



let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]


app.use(dexter('tiny'));
app.use(cors());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
})

app.get('/api/notes/:id', (request, response) => {
  // here we find out that the id is string and note.id is integer, so we have to parse it 
  const id = Number(request.params.id);
  const note = notes.find(note => note.id === id)

  // what if we didn't find a note? 
  // the if conditions uses that fact that `undefined` is FALSY, whereas other objects are TRUTHY
  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
})

app.get('/api/notes', (request, response) => {
  response.set('content-Type', 'application/json');
  response.send(notes);
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter(note => note.id !== id);

  response.status(204).end();
})

const generageId = () => {
  const maxid = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0;

  return maxid + 1;
}

app.post('/api/notes', (request, response) => {
  const body = request.body;

  if (!body.content) {
    return response.status(400).json({
      error: 'content is missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generageId()
  }

  notes = notes.concat(note);

  // console.log(request.headers)
  response.json(note)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
