const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Database connection
const connectDb = require("./src/config/dbConnection");

// Routes
const userRoutes = require("./src/routes/userRoutes");
const songRoutes = require("./src/routes/songRoutes");
const playlistRoutes = require("./src/routes/playlistRoutes");

connectDb();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// User routes
app.use("/api/users", userRoutes);

// Song routes
app.use("/api/songs", songRoutes);

// User Playlist routes
app.use("/api/playlists", playlistRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
