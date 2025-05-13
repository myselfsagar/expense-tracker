const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const premiumMiddleware = require("../middlewares/premiumMiddleware");
const premiumController = require("../controllers/premium");
const router = express.Router();

router.get(
  "/showLeaderbord",
  authMiddleware,
  premiumMiddleware,
  premiumController.showLeaderboard
);
router.get(
  "/downloadExpenses",
  authMiddleware,
  premiumMiddleware,
  premiumController.downloadExpenses
);
router.get(
  "/downloadHistory",
  authMiddleware,
  premiumMiddleware,
  premiumController.getDownloadHistory
);

module.exports = router;
