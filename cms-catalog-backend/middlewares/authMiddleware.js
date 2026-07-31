const { verifyToken } = require("../utils/jwtHelpers");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Get token from Authorization header

  if (!token) {
    // Jika tidak ada token, secara semantik ini adalah Unauthorized (401), bukan Forbidden (403).
    // 403 (Forbidden) berarti user memiliki identitas, tapi tidak punya izin untuk resource tersebut.
    // 401 (Unauthorized) berarti user belum terautentikasi (atau gagal autentikasi).
    return res.status(401).json({ message: "Authentication token is required." }); // <-- UBAH KE 401
  }

  try {
    const decoded = verifyToken(token); // Verify token
    req.user = decoded; // Attach user data to request
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    // Jika token tidak valid atau kedaluwarsa, ini juga 401 Unauthorized.
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;