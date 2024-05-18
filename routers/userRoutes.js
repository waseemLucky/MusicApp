// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userCongtroller");

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);

// More user-related routes like creating/deleting playlists can go here...

module.exports = router;
