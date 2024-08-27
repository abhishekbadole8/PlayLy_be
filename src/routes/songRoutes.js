const express = require("express");

const {
  addSong,
  getAllSongs,
  getTrending,
} = require("../controllers/songController");

const authenticate = require("../middlewares/authenticate");

const multer = require("multer");
const router = express.Router();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

// Regular song routes
router.get("/", getAllSongs);

// Upload song
router.post("/upload", authenticate, upload.array("files", 5), addSong);

// Trending song routes
router.get("/trending", getTrending);

module.exports = router;
