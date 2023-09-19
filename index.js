require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const PhoneNumber = require("./models/phonenumber");

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
  PhoneNumber.find({}).then((number) => {
    res.json(number);
  });
  //res.json(persons);
});

app.get("/api/persons/:id", (request, response, next) => {
  PhoneNumber.findById(request.params.id)
    .then((number) => {
      if (number) {
        response.json(number);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      next(error);
    });
});

app.delete("/api/persons/:id", (request, response, next) => {
  PhoneNumber.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.get("/info", (req, res) => {
  const date = new Date().toString();
  const phoneBookInfo = `<p>Phonebook has info for ${persons.length} people</p>
  <p>${date}</p>`;
  res.send(phoneBookInfo);
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

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

  const number = new PhoneNumber({
    name: body.name,
    number: body.number,
  });

  number
    .save()
    .then((savedNumber) => {
      response.json(savedNumber);
    })
    .catch((error) => next(error));
});
app.put("/api/persons/:id", (request, response, next) => {
  const body = request.body;

  const number = {
    name: body.name,
    number: body.number,
  };

  PhoneNumber.findByIdAndUpdate(request.params.id, number, { new: true })
    .then((updatedNumber) => {
      response.json(updatedNumber);
    })
    .catch((error) => next(error));
});

const errorHandler = (error, request, response, next) => {
  // Handle the errors
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  response.status(500).json({ error: "Internal server error" });
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
