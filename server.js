'use strict';
// Required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const SpotifyWebApi = require('spotify-web-api-node');
const { loginCallback } = require('./controllers/loginCallback.js')
const { refreshCallback } = require('./controllers/refreshCallback.js')
mongoose.connect(process.env.DB_URL);
const PORT = process.env.PORT || 3001;

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('Mongoose is connected');
})

//Middleware
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'))


app.get('/', (req, res) => {

  res.status(200).render('./index.html')

})

app.post('/login', loginCallback)


app.post('/refresh', refreshCallback)


// Improper URL handling
app.get('*', (req, res) => {
  res.send('Page not found')
})

// Server error handling
app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).send(error.message + "error")
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));