const PlaylistSchema = require('../models/Playlist-model.js')

exports.playListCallback = async (req, res) => {
  const { user_id } = req.params;
  console.log(user_id)
  const items = await PlaylistSchema.find({ user_id });
  res.status(200).json(items);
}

exports.deleteSongCallback = async (req, res) => {
  const { _id } = req.params;
  console.log(_id)
  const deletedSong = await PlaylistSchema.findByIdAndDelete({ _id });
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
