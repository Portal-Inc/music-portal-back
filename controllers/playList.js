const PlaylistSchema = require('../models/Playlist-model.js')

exports.playListCallback = async (req, res) => {
  const items = await PlaylistSchema.find({});
  res.status(200).json(items);
}

exports.deleteSongCallback = async (req, res) => {
  const id = req.params.id;
  const deletedSong = await PlaylistSchema.findByIdAndDelete(id);
  res.status(200).send(deletedSong);
}

exports.addSongCallback = async (req, res, next) => {
  try {
    const data = req.body;
    console.log(data)
    const item = new PlaylistSchema(data);
    await item.save();
    res.status(200).json(item);
  } catch (e) { next(e.message); }
}
