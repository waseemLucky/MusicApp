// controllers/userController.js
const User = require("../models/User");
const Song = require("../models/Song");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateUserProfile = async (req, res) => {
  const { name, profilePicture, posterPictures } = req.body;

  try {
    const user = await User.findById(req.user.id);

    if (name) user.name = name;
    if (profilePicture) user.profilePicture = profilePicture;
    if (posterPictures) user.posterPictures = posterPictures;

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// More user-related controllers like making a playlist can go here...
