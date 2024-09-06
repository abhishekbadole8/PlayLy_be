const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { storage } = require("../config/firebaseConfig");
const Song = require("../models/songModel");

// Allowed audio MIME types
const ALLOWED_AUDIO_MIME_TYPES = [
  "audio/mpeg", // MP3
  "audio/wav", // WAV
  "audio/ogg", // OGG
  "audio/flac", // FLAC
  "audio/aac", // AAC
];

// @desc Upload multiple songs
// @route POST /api/songs/
const addSong = async (req, res) => {
  try {
    const { source } = req.body;
    const { files, userId } = req;

    // Validate that all required fields are present
    if (!source || !files || files.length === 0) {
      return res.status(400).json({
        message: "Source and at least one file are required",
      });
    }

    const songs = [];

    // Dynamically import music-metadata
    const { parseBuffer } = await import("music-metadata");

    // Loop through each file
    for (const file of files) {
      // Validate the file type
      if (!ALLOWED_AUDIO_MIME_TYPES.includes(file.mimetype)) {
        return res.status(400).json({
          message: `Invalid file type: ${file.originalname}. Only audio files are allowed.`,
        });
      }

      // Extract metadata from the audio file
      const metadata = await parseBuffer(file.buffer, file.mimetype);

      // Create the new song document in MongoDB
      const song = await Song.create({
        userId,
        source,
        title: metadata.common.title || "Unknown Title",
        artist: metadata.common.artist || "Unknown Artist",
        album: metadata.common.album || "Unknown Album",
        genre: metadata.common.genre
          ? metadata.common.genre.join(", ")
          : "Unknown Genre",
        duration: metadata.format.duration || 0,
      });

      // Generate a reference to the folder in Firebase Storage using the song document's ID
      const songFolderRef = ref(storage, `songs/${song._id}`);

      // Upload the audio file to the folder
      const audioFileRef = ref(songFolderRef, file.originalname);
      await uploadBytesResumable(audioFileRef, file.buffer, metadata);

      // Get the download URL for the uploaded audio file
      const firebaseAudioUrl = await getDownloadURL(audioFileRef);

      // Prepare image data and upload to Firebase Storage if available
      let imageUrl = null;
      if (metadata.common.picture) {
        const imageBuffer = metadata.common.picture[0].data;
        const imageMimeType = metadata.common.picture[0].format;
        const imageFileRef = ref(
          songFolderRef,
          `image.${imageMimeType.split("/")[1]}`
        );

        // Upload the image to Firebase Storage
        await uploadBytesResumable(imageFileRef, imageBuffer);

        // Get the download URL for the uploaded image file
        imageUrl = await getDownloadURL(imageFileRef);
      }

      // Update the song document with the Firebase URLs
      song.firebaseUrl = firebaseAudioUrl;
      song.imageUrl = imageUrl;
      await song.save();

      songs.push(song);
    }

    res.status(201).json({ songs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc GET Songs
// @route GET /api/songs/
const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find();
    res.status(200).json(songs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc GET trendings songs
// @route GET /api/songs/trendings
const getTrendings = async (req, res) => {
  try {
    // Get the total number of songs
    const totalSongs = await Song.countDocuments();

    // Calculate the number of songs in the top 20%
    const topPercentageCount = Math.ceil(totalSongs * 0.35);

    // Fetch the top 20% of songs based on play count
    const trendingSongs = await Song.find()
      .sort({ playCount: -1 })
      .limit(topPercentageCount);

    res.status(200).json(trendingSongs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trending songs" });
  }
};

// @desc Increment play count
// @route PUT /api/songs/:songId/play
const incrementPlayCount = async (req, res) => {
  try {
    const songId = req.params.songId;

    const song = await Song.findByIdAndUpdate(
      songId,
      { $inc: { playCount: 1 } }, // Increment playCount by 1
      { new: true }
    );

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json(song);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating play count", error: error.message });
  }
};

// @desc Increment download count
// @route PUT /api/songs/:songId/download
const incrementDownloadCount = async (req, res) => {
  try {
    const songId = req.params.songId;

    const song = await Song.findByIdAndUpdate(
      songId,
      { $inc: { downloadCount: 1 } }, // Increment downloadCount by 1
      { new: true }
    );

    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    res.status(200).json(song);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating download count", error: error.message });
  }
};

module.exports = {
  addSong,
  getAllSongs,
  getTrendings,
  incrementPlayCount,
  incrementDownloadCount,
};
