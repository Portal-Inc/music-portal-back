'use strict';
// Required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const SpotifyWebApi = require('spotify-web-api-node');
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

app.post('/login', (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })

  spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {

      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(error => {
      console.log(error.message)
      res.sendStatus(400)
    })
})


app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  })

  spotifyApi
    .refreshAccessToken()
    .then(data => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      })
    })
    .catch(error => {
      console.log(error.message)
      res.sendStatus(400)
    })
})



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