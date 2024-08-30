const express = require("express");
const authenticate = require("../middlewares/authenticate");

const {
  createPlaylist,
  getUserPlaylists,
  addRemoveSongInPlaylist,
  deletePlaylist,
  updatePlaylist,
} = require("../controllers/playlistController");

const router = express.Router();

router.use(authenticate);

router.get("/", getUserPlaylists);

// Create a new playlist
router.post("/", createPlaylist);

// Update playlist title
router.put("/:playlistId", updatePlaylist);

// Add/Remove Song in a playlist
router.put("/:playlistId", addRemoveSongInPlaylist);

// Delete a playlist
router.delete("/:playlistId", deletePlaylist);

module.exports = router;
