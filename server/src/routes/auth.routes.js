const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/social-login", authController.socialLogin);
router.get("/me", protect, authController.getMe);

module.exports = router;
