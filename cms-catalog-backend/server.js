const express = require("express");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const productRoutes = require("./routes/productRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const cors = require("cors");
const uploadRoutes = require("./routes/uploadRoutes");
const path = require('path');

const app = express();

require("dotenv").config(); // Make sure this is at the very top of your file

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS if needed

// Middleware untuk melayani file statis dari folder 'uploads'
// File yang diunggah akan bisa diakses melalui URL: http://localhost:3000/uploads/namafile.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Authentication routes (login, register, me)
app.use("/api/auth", authRoutes);

// Booking routes (bookings and my bookings)
app.use("/api", bookingRoutes);

// Lapangan routes (manage lapangan)
app.use("/api", productRoutes);

app.use("/api", uploadRoutes);

// Catch-all route for 404 errors (when no matching route is found)
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
