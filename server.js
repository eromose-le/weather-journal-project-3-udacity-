// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Start up an instance of app
const app = express();

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
const port = 5000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

// get function
app.get('/all', sendData);
function sendData(req, res) {
  res.send(projectData);
}

// post function
app.post('/addData', addData);
function addData(req, res) {
  let { date, temp, feelings } = req.body;

  projectData.date = date;
  projectData.temp = temp;
  projectData.feelings = feelings;

  res.send(projectData);
}
