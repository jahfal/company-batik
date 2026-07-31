const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/booking", authMiddleware, bookingController.createBooking);
router.get("/booking", authMiddleware, bookingController.getMyBookings);

module.exports = router;
