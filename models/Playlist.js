'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;


const playlistSchema = new Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: Array, required: true },
  uri: { type: String, required: true },
  img_url: { type: String, required: false }
});

module.exports = mongoose.model('Playlist', playlistSchema);