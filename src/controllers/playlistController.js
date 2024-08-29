const Playlist = require("../models/playlistModel");

// @desc Create playlist
// @route POST api/playlists/
// @access private
const createPlaylist = async (req, res) => {
  try {
    const { title } = req.body;
    const userId = req.userId;

    if (!title) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    // Update the playlist if it exists, otherwise create a new one
    const updatedPlaylist = await Playlist.findOneAndUpdate(
      { userId },
      { $push: { playlists: { title, songs: [] } } },
      { new: true, upsert: true }
    );

    // Extract the last pushed playlist
    const newPlaylist =
      updatedPlaylist.playlists[updatedPlaylist.playlists.length - 1];

    res.status(201).json(newPlaylist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Get user playlists
// @route GET api/playlists/
// @access private
const getUserPlaylists = async (req, res) => {
  try {
    const userId = req.userId;

    const playlist = await Playlist.findOne({ userId });

    if (!playlist) {
      return res.status(200).json([]);
    }

    res.status(200).json(playlist.playlists);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update playlist title
// @route PUT api/playlists/:playlistId
// @access private
const updatePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Playlist name is required" });
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    playlist.title = title;

    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Add/Remove from playlist
// @route POST api/songs/:playlistId/:songId
// @access private
const addRemoveSongInPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;

    if (!playlistId || !songId) {
      return res
        .status(400)
        .json({ message: "Playlist ID and Song ID are required" });
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    const songIndex = playlist.songs.indexOf(songId);

    if (songIndex !== -1) {
      playlist.songs.splice(songIndex, 1);
    } else {
      playlist.songs.push(songId);
    }

    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Delete playlist
// @route DELETE api/playlists/:playlistId
// @access private
const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }

    await playlist.remove();

    res.status(200).json({ message: "Playlist deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createPlaylist,
  getUserPlaylists,
  updatePlaylist,
  addRemoveSongInPlaylist,
  deletePlaylist,
};
