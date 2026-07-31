const Booking = require("../models/Booking");
const Lapangan = require("../models/Product");
const { Op } = require("sequelize");

class BookingService {
  // Create a new booking
  static async createBooking(
    id_pengguna,
    id_lapangan,
    tanggal,
    waktu_mulai,
    waktu_selesai
  ) {
    const lapangan = await Lapangan.findByPk(id_lapangan);
    if (!lapangan) {
      throw new Error("Lapangan not found");
    }

    // Ensure all required fields are provided
    if (!tanggal || !waktu_mulai || !waktu_selesai) {
      throw new Error("Missing required booking details");
    }

    // Combine the date and time for both start and end time
    const startTime = new Date(`${tanggal}T${waktu_mulai}:00Z`);
    const endTime = new Date(`${tanggal}T${waktu_selesai}:00Z`);

    // Check for existing bookings that overlap with the requested booking time
    const existingBooking = await Booking.findOne({
      where: {
        id_lapangan: id_lapangan,
        tanggal: tanggal,
        [Op.or]: [
          {
            waktu_mulai: {
              [Op.lt]: waktu_selesai, // Existing booking starts before the new end time
            },
            waktu_selesai: {
              [Op.gt]: waktu_mulai, // Existing booking ends after the new start time
            },
          },
        ],
      },
    });

    if (existingBooking) {
      throw new Error("Lapangan is already booked for the selected time slot.");
    }

    // Calculate the time difference in hours
    const timeDifference = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours

    if (timeDifference <= 0) {
      throw new Error("End time must be after start time");
    }

    // Calculate the total price based on the time difference and harga_per_jam
    const total_harga = timeDifference * lapangan.harga_per_jam;

    // Create the booking
    const booking = await Booking.create({
      id_pengguna,
      id_lapangan,
      tanggal,
      waktu_mulai,
      waktu_selesai,
      total_harga,
    });

    return booking;
  }

  // Get bookings for a specific user
  static async getMyBookings(userId) {
    return Booking.findAll({
      where: { id_pengguna: userId },
      include: [Lapangan],
    });
  }
}

module.exports = BookingService;
