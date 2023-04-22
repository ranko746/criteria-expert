const express = require('express');
var cors = require('cors')
const bodyParser = require('body-parser');

// create express app
const app = express();

// Setup server port
const port = process.env.PORT || 5000;

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

app.use(cors());

// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});

// Require routes
const chatRoutes = require('./src/routes/chat.routes');
const answerRoutes = require('./src/routes/answer.routes')
const questionRoutes = require('./src/routes/question.routes')

// using as middleware
app.use("/api/v1/ai",chatRoutes);
app.use("/api/v1/answer",answerRoutes);
app.use("/api/v1/question",questionRoutes);

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});