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


app.get('/', (req, res) => {

  res.status(200).render('./index.html')

})

app.post('/login', loginCallback)

app.post('/refresh', refreshCallback)

app.get('/play-list', playListCallback)

app.post('/add-song', addSongCallback)

app.delete('/delete', deleteSongCallback)

app.get('/lyrics', async(req, res) => {
  // console.log(req.query);
const lyrics = await lyricsFinder(req.query.artist, req.query.track) || 'No Lyrics Found!'
console.log(lyrics);
res.status(200).send([lyrics])
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