const User = require("../models/userModel");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (user && user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = isAdmin;
