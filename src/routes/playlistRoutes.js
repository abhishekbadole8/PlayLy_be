const express = require("express");
const authenticate = require("../middlewares/authenticate");

const {
  createPlaylist,
  getPlaylists,
  getPlaylistSongs,
  addRemoveSongInPlaylist,
  deletePlaylist,
  updatePlaylist,
} = require("../controllers/playlistController");

const router = express.Router();

// Middlware to check only auth user
router.use(authenticate);

// Get Playlists
router.get("/", getPlaylists);

// Get Playlist Songs
router.get("/:playlistId", getPlaylistSongs);

// Create a new playlist
router.post("/", createPlaylist);

// Update playlist title
router.put("/:playlistId", updatePlaylist);

// Add/Remove Song in a playlist
router.put("/:playlistId/:songId", addRemoveSongInPlaylist);

// Delete a playlist
router.delete("/:playlistId", deletePlaylist);

module.exports = router;
