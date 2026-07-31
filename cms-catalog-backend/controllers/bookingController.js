const BookingService = require("../services/bookingService");
const { sendError } = require("../utils/errorHelpers");

exports.createBooking = async (req, res) => {
  const { id_lapangan, tanggal, waktu_mulai, waktu_selesai, total_harga } =
    req.body;

  try {
    // Directly pass individual booking details to the service method
    const booking = await BookingService.createBooking(
      req.user.id_pengguna, // User ID
      id_lapangan, // Lapangan ID
      tanggal, // Tanggal
      waktu_mulai, // Waktu Mulai
      waktu_selesai, // Waktu Selesai
      total_harga // Total Harga
    );

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error); // Log the error for debugging
    sendError(res, 500, "Error creating booking", error);
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    // Use the BookingService to get the bookings for the current user
    const bookings = await BookingService.getMyBookings(req.user.id_pengguna);

    res.json(bookings);
  } catch (error) {
    console.error(error); // Log the error for debugging
    sendError(res, 500, "Error retrieving bookings", error);
  }
};
