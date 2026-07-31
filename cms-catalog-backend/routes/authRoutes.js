const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

// Register a new user
router.post("/register", authController.register);

// Login a user
router.post("/login", authController.login);

// Get current authenticated user (requires auth)
router.get("/me", authMiddleware, authController.getCurrentUser);

module.exports = router;
