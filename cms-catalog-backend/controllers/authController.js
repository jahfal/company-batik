const { hashPassword, comparePassword } = require("../utils/hashHelpers");
const { generateToken } = require("../utils/jwtHelpers");
const { sendError } = require("../utils/errorHelpers");
const Pengguna = require("../models/Pengguna");

// Register a new user
exports.register = async (req, res) => {
  const { nama, email, password, role } = req.body;

  try {
    // Check if email already exists
    const existingUser = await Pengguna.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 400, "Email already in use");
    }

    // Hash the password using the hash helper
    const hashedPassword = await hashPassword(password);

    // Create the user
    const newUser = await Pengguna.create({
      nama,
      email,
      password: hashedPassword,
      role: role || "user", // Default to 'user' if role is not provided
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    sendError(res, 500, "Server error", error);
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    console.log("Login attempt for email:", email);
    const user = await Pengguna.findOne({ where: { email } });
    
    // Check if the user was found and log the result
    if (!user) {
      console.log("User not found.");
      return sendError(res, 400, "Invalid email or password");
    }
    console.log("User found. Comparing passwords.");
    
    // Check if passwords match and log the result
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      console.log("Password comparison failed.");
      return sendError(res, 400, "Invalid email or password");
    }
    console.log("Password match. Generating token.");
    
    // Generate JWT token
    const token = generateToken(user);
    console.log("Token generated. Sending response.");
    
    res.json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    // This is the safety net if something unexpected crashes the server
    console.error("Login route failed with an unhandled error:", error.message);
    sendError(res, 500, "Server error", error);
  }
};
// Get current user (optional)
exports.getCurrentUser = (req, res) => {
  res.json({
    id_pengguna: req.user.id_pengguna,
    nama: req.user.nama,
    email: req.user.email,
    role: req.user.role,
  });
};
