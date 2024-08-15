const express = require("express");
const router = express.Router();

const {
  createUser,
  loginUser,
  addPlaylistToUser,
  removePlaylistFromUser,
} = require("../controllers/userController");


router.post("/register", createUser);
router.post("/login", loginUser);
router.put("/:userId/playlist/:playlistId", addPlaylistToUser);
router.delete("/:userId/playlist/:playlistId", removePlaylistFromUser);

module.exports = router;
