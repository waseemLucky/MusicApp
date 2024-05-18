// controllers/songController.js
const Song = require("../models/Song");
const User = require("../models/User");
const multer = require("multer");
const path = require("path");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

exports.uploadSong = [
  upload.single("file"),
  async (req, res) => {
    const { title, artist } = req.body;
    const file = req.file.path;

    try {
      const newSong = new Song({
        title,
        artist,
        file,
        uploadedBy: req.user.id,
      });

      const song = await newSong.save();
      res.json(song);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  },
];

exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    if (song.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await song.remove();
    res.json({ msg: "Song removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.updateSong = async (req, res) => {
  const { title, artist } = req.body;

  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    if (song.uploadedBy.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    if (title) song.title = title;
    if (artist) song.artist = artist;

    await song.save();
    res.json(song);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.likeSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    if (song.likes.some((like) => like.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Song already liked" });
    }

    song.likes.unshift(req.user.id);
    await song.save();
    res.json(song.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.dislikeSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    if (!song.likes.some((like) => like.toString() === req.user.id)) {
      return res.status(400).json({ msg: "Song has not yet been liked" });
    }

    song.likes = song.likes.filter((like) => like.toString() !== req.user.id);
    await song.save();
    res.json(song.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.commentOnSong = async (req, res) => {
  const { text } = req.body;

  try {
    const song = await Song.findById(req.params.id);

    if (!song) {
      return res.status(404).json({ msg: "Song not found" });
    }

    const newComment = {
      user: req.user.id,
      text,
    };

    song.comments.unshift(newComment);
    await song.save();
    res.json(song.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Additional song-related controllers can go here...
