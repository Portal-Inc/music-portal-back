'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;


const PlaylistSchema = new Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: Array, required: true },
  uri: { type: String, required: true },
  img_url: { type: Array, required: false }
});

module.exports = mongoose.model('playlist', PlaylistSchema);