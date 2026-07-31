// utils/jwtHelper.js
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    id_pengguna: user.id_pengguna,
    nama: user.nama,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = { generateToken, verifyToken };
