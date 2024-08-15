const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// @desc Register a new user
// @route POST api/user/register
// @access public
const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if all fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All field's are mandatory !!!" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Login a user
// @route POST api/user/login
// @access public route
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if all fields are provided
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are mandatory!!!" });
    }

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate a JSON Web Token (JWT)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Add a playlist to a user's playlistIds
// @route PUT api/user/:userId/playlist/:playlistId
// @access private
const addPlaylistToUser = async (req, res) => {
  try {
    const { userId, playlistId } = req.params;

    // Find the user and update the playlistIds
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { playlistIds: playlistId } }, // Use $addToSet to avoid duplicates
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error); // For debugging
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Remove a playlist from a user's playlistIds
// @route DELETE api/user/:userId/playlist/:playlistId
// @access private
const removePlaylistFromUser = async (req, res) => {
  try {
    const { userId, playlistId } = req.params;

    // Find the user and update the playlistIds
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { playlistIds: playlistId } }, // Use $pull to remove the specific ID
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error); // For debugging
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createUser, loginUser, addPlaylistToUser, removePlaylistFromUser };
