// routes/songRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  uploadSong,
  deleteSong,
  updateSong,
  likeSong,
  dislikeSong,
  commentOnSong,
} = require("../controllers/songController");

router.post("/", auth, uploadSong);
router.delete("/:id", auth, deleteSong);
router.put("/:id", auth, updateSong);
router.put("/like/:id", auth, likeSong);
router.put("/dislike/:id", auth, dislikeSong);
router.post("/comment/:id", auth, commentOnSong);

// Additional song-related routes can go here...

module.exports = router;
