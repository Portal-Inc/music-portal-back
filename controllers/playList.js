const PlaylistSchema = require('../models/Playlist-model.js')

exports.playListCallback = async (req, res) => {
  const { user_id } = req.params;

  const items = await PlaylistSchema.find({ user_id });
  res.status(200).json(items);
}

exports.deleteSongCallback = async (req, res) => {
  const { _id } = req.params;

  const deletedSong = await PlaylistSchema.findByIdAndDelete({ _id });
  res.status(200).send(deletedSong);
}

exports.addCommentCallback = async (req, res) => {
  const id = req.params._id;
  const data = req.body;
  const updatedItem = await PlaylistSchema.findByIdAndUpdate({ _id: id }, data, { new: true, overwrite: true })
  res.status(200).send(updatedItem);
}

exports.addSongCallback = async (req, res, next) => {
  try {
    const data = req.body;

    const item = new PlaylistSchema(data);
    await item.save();
    res.status(200).json(item);
  } catch (e) { next(e.message); }
}

exports.getOneSongCallback = async (req, res) => {
  const { _id } = req.params;

  const items = await PlaylistSchema.findById({ _id });
  res.status(200).json(items);
}