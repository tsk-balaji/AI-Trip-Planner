const express = require("express");

const {
  registerUser,
  loginUser,
  activateAccount,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const { geminiAI } = require("../controllers/tripController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/activate/:token", activateAccount);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/geminiAI", geminiAI);

module.exports = router;
