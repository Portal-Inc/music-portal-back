'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;


const PlaylistSchema = new Schema({
  user_id: { type: String, required: true },
  title: { type: String, required: true },
  artist: { type: String, required: true },
  uri: { type: String, required: true },
  user_notes: { type: String, required: false },
  img_url: { type: String, required: false }
});

module.exports = mongoose.model('playlist', PlaylistSchema);