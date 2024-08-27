const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    userId: {
      ref: "User",
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    firebaseUrl: {
      type: String,
      // required: true,
    },
    title: {
      type: String,
      default: "Unknown Title",
    },
    artist: {
      type: String,
      default: "Unknown Artist",
    },
    album: {
      type: String,
      default: "Unknown Album",
    },
    genre: {
      type: String,
      default: "Unknown Genre",
    },
    duration: {
      type: Number,
      default: 0,
    },
    imageUrl: {
      type: String,
      default: null,
    },
    playCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Song", songSchema);
