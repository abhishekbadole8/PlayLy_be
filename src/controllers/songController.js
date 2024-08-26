const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const { storage } = require("../config/firebaseConfig");
const Song = require("../models/songModel");

// @desc POST Song
// @route POST /api/songs/
const addSong = async (req, res) => {
  try {
    const { source } = req.body;
    const { file, userId } = req;

    // Validate that all required fields are present
    if (!source || !file) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Allowed audio MIME types
    const ALLOWED_AUDIO_MIME_TYPES = [
      "audio/mpeg", // MP3
      "audio/wav", // WAV
      "audio/ogg", // OGG
      "audio/flac", // FLAC
      "audio/aac", // AAC
    ];

    // Validate the file type
    if (!ALLOWED_AUDIO_MIME_TYPES.includes(file.mimetype)) {
      return res.status(400).json({
        message: "Invalid file type. Only audio files are allowed.",
      });
    }

    // Dynamically import music-metadata
    const { parseBuffer } = await import("music-metadata");

    // Extract metadata from the audio file
    const metadata = await parseBuffer(file.buffer, file.mimetype);

    // Generate a reference to the file in Firebase Storage
    const storageRef = ref(storage, `songs/${file.originalname}`);

    await uploadBytesResumable(storageRef, file.buffer, metadata);

    // Get the download URL for the uploaded file
    const firebaseUrl = await getDownloadURL(storageRef);

    // Prepare image data
    let imageUrl = null;
    if (metadata.common.picture) {
      const imageBuffer = metadata.common.picture[0].data;
      const imageMimeType = metadata.common.picture[0].format;
      imageUrl = `data:${imageMimeType};base64,${imageBuffer.toString(
        "base64"
      )}`;
    }

    // Create the new song document in MongoDB
    const song = await Song.create({
      userId,
      source,
      firebaseUrl,
      title: metadata.common.title || "Unknown Title",
      artist: metadata.common.artist || "Unknown Artist",
      album: metadata.common.album || "Unknown Album",
      genre: metadata.common.genre
        ? metadata.common.genre.join(", ")
        : "Unknown Genre",
      duration: metadata.format.duration || 0,
      imageUrl,
    });

    res.status(201).json(song);
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

// @desc GET trending songs
// @route GET /api/songs/trending
const getTrending = async (req, res) => {
  try {
    const trendingSongs = await Song.find().sort({ playCount: -1 }).limit(10);
    res.status(200).json(trendingSongs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching trending songs" });
  }
};

module.exports = { addSong, getAllSongs, getTrending };
