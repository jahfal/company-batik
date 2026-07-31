// utils/hashHelper.js
const bcrypt = require("bcryptjs");

// Hash password
const hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

// Compare passwords
const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};

module.exports = { hashPassword, comparePassword };
