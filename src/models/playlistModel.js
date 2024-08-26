const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    playlists: [
      {
        title: {
          type: String,
          required: true,
        },
        songs: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Song",
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Playlist", playlistSchema);
