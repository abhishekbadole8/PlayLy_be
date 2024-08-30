const express = require("express");

const {
  addSong,
  getAllSongs,
  getTrendings,
} = require("../controllers/songController");

const authenticate = require("../middlewares/authenticate");
const isAdmin = require("../middlewares/isAdmin");

const multer = require("multer");
const router = express.Router();

// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

router.use(authenticate);

// Regular song routes
router.get("/", getAllSongs);

// Upload song
router.post("/upload", isAdmin, upload.array("files", 5), addSong);

// Trending song routes
router.get("/trendings", getTrendings);

module.exports = router;
