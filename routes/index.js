const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const wordController = require("../controllers/wordController");
const levelController = require("../controllers/levelController");
const leaderboardController = require("../controllers/leaderboardController");
const gameController = require("../controllers/gameController");
const siswaController = require("../controllers/siswaController");
const activityController = require("../controllers/activityController");
const authenticate = require("../middleware/auth");
const upload = require("../middleware/upload");

// Admin Routes
router.post("/admin/login", adminController.loginAdmin);
router.post("/admin/register", adminController.createAdmin);

// Word Routes
router.get("/words", wordController.getAllWords);
router.post("/words", authenticate, upload.single("image"), wordController.addWord);
router.put(
  "/words/:id",
  authenticate,
  upload.single("image"),
  wordController.updateWord
);

router.delete("/words/:id", authenticate, wordController.deleteWord);

// Siswa Routes
router.get("/siswa/search", siswaController.searchSiswa); 
router.get("/siswa", siswaController.getSiswa);
router.get("/siswa/:id", siswaController.getSiswaById);
router.post("/siswa", authenticate, siswaController.createSiswa);
router.put("/siswa/:id", authenticate, siswaController.updateSiswa);
router.delete("/siswa/:id", authenticate, siswaController.deleteSiswa);


// Level Routes
router.get("/levels", levelController.getLevels);
router.post("/levels", authenticate, levelController.createLevel);
router.put("/levels/:id", authenticate, levelController.updateLevel);
router.delete("/levels/:id", authenticate, levelController.deleteLevel);

// Leaderboard Routes
router.get("/leaderboard", leaderboardController.getLeaderboard);
router.post("/leaderboard", leaderboardController.createLeaderboard);
router.delete("/leaderboard/reset", leaderboardController.resetLeaderboard);
router.delete("/leaderboard/:id", leaderboardController.deleteLeaderboard);

// Activity Routes
router.get("/activity", activityController.getRecentActivities);
router.delete("/activity/reset", activityController.resetActivities);

// Game Session Routes
router.get("/game/:levelId", gameController.getGameData);
router.post("/game/submit", gameController.submitScore);

module.exports = router;
