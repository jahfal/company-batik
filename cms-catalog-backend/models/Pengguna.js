const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Pengguna = sequelize.define(
  "Pengguna",
  {
    id_pengguna: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "user"), allowNull: false },
  },
  {
    tableName: "Pengguna", // Ensures the table name is singular
  }
);

module.exports = Pengguna;
