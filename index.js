const express = require("express");
var morgan = require("morgan");
const app = express();
app.use(express.json());
const cors = require("cors");
app.use(express.static("dist"));
app.use(cors());
//app.use(morgan("tiny"));

// Define a custom token for Morgan
morgan.token("req-body", (req) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

// Add Morgan middleware with custom format
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - :req-body"
  )
);
let persons = [
  {
    name: "testt",
    number: "test",
    id: 1,
  },
  {
    name: "teeee",
    number: "teeeee",
    id: 2,
  },
  {
    name: "a",
    number: "a",
    id: 3,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

app.get("/info", (req, res) => {
  const date = new Date().toString();
  const phoneBookInfo = `<p>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>`;
  res.send(phoneBookInfo);
});
app.post("/api/persons", (request, response) => {
  const body = request.body;
  const id = Math.floor(Math.random() * 100000);
  if (!body.name) {
    return response.status(400).json({
      error: "name missing",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "number missing",
    });
  }

  if (persons.some((person) => person.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: id,
  };
  persons = persons.concat(person);
  response.json(person);
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
