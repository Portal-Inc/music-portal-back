'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;


const playlistSchema = new Schema({
  user_id: { type: String, required: true },
  title: { type: Array, required: true },
  artist: { type: String, required: true },
  uri: { type: String, required: true },
  img_uri: { type: String, required: false }
});

module.exports = mongoose.model('Playlist', playlistSchema);