'use strict';
// Required modules
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const lyricsFinder = require('lyrics-finder')
//Spotify Related Api
const SpotifyWebApi = require('spotify-web-api-node');

const {
  playListCallback,
  addSongCallback,
  deleteSongCallback
} = require('./controllers/playList.js')
const { refreshCallback } = require('./controllers/refreshCallback.js')
//database requires
const { loginCallback } = require('./controllers/loginCallback.js')




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

const getLyricsCallback = async (req, res) => {
  try {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || 'No Lyrics Found!'
    console.log(lyrics);
    res.status(200).send([lyrics])
  } catch (error) {
    console.log(error.message)
  }
};

app.get('/', (req, res) => {

  res.status(200).render('./index.html')

})

app.post('/login', loginCallback)

app.post('/refresh', refreshCallback)

app.get('/play-list/:user_id', playListCallback)

app.post('/add-song', addSongCallback)

app.delete('/delete/:_id', deleteSongCallback)

app.get('/lyrics', getLyricsCallback)





app.post('/refresh', (req, res) => {
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
      console.log(data.body)
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(error => {
      console.log(error.message)
      res.sendStatus(400)
    })
})

app.post('/about', (req, res) => {
  const code = req.body.code
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  spotifyApi
    .refreshAccessToken(code)
    .then(data => {
      console.log(data.body)
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(error => {
      console.log(error.message)
      res.sendStatus(400)
    })
})

app.get('/lyrics', async (req, res) => {
  const lyrics = await lyricsFinder(req.query.artist, req.query.track) || 'No Lyrics Found'
  res.status(200).send([lyrics])

})

app.get('*', (req, res) => {
  res.send('Page not found')
})

// Server error handling
app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).send(error.message + "error")
})

app.listen(PORT, () => console.log(`listening on ${PORT}`));