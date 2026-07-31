// models/Booking.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Pengguna = require("./Pengguna");
const Lapangan = require("./Product");

const Booking = sequelize.define(
  "Booking",
  {
    id_booking: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_pengguna: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "pengguna", // Singular "pengguna"
        key: "id",
      },
    },
    id_lapangan: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "lapangan", // Singular "lapangan"
        key: "id",
      },
    },
    tanggal: { type: DataTypes.DATEONLY, allowNull: false },
    waktu_mulai: { type: DataTypes.TIME, allowNull: false },
    waktu_selesai: { type: DataTypes.TIME, allowNull: false },
    total_harga: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  },
  {
    tableName: "booking", // Explicitly set table name to "booking"
    timestamps: true, // Enable timestamps for createdAt and updatedAt
  }
);

Booking.belongsTo(Pengguna, { foreignKey: "id_pengguna" });
Booking.belongsTo(Lapangan, { foreignKey: "id_lapangan" });

module.exports = Booking;
