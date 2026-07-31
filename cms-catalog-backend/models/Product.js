// models/Product.js
const { DataTypes } = require("sequelize"); // DataTypes sudah diimpor
const sequelize = require("../config/database"); // Pastikan path ini benar untuk instance sequelize Anda

const Product = sequelize.define(
  "Product", // Nama model (huruf kapital, singular)
  {
    id_product: {
      // Changed primary key name
      type: DataTypes.INTEGER, // <-- UBAH KE DataTypes.INTEGER
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      // Product name
      type: DataTypes.STRING(255), // <-- UBAH KE DataTypes.STRING
      allowNull: false,
    },
    description: {
      // Product description
      type: DataTypes.TEXT, // <-- UBAH KE DataTypes.TEXT
      allowNull: true,
    },
    price: {
      // Product price
      type: DataTypes.DECIMAL(10, 2), // <-- UBAH KE DataTypes.DECIMAL
      allowNull: false,
    },
    category: {
      // Product category (e.g., "electronics", "clothing", "books")
      type: DataTypes.STRING(100), // <-- UBAH KE DataTypes.STRING
      allowNull: true,
    },
    image_url: {
      // URL for product image
      type: DataTypes.STRING(255), // <-- UBAH KE DataTypes.STRING
      allowNull: true,
    },
    tokopedia_url: {
      type: DataTypes.STRING(255),
      allowNull: true, // Link bisa saja opsional
    },
    shopee_url: {
      type: DataTypes.STRING(255),
      allowNull: true, // Link bisa saja opsional
    },
    // stock: { // Available stock
    //   type: DataTypes.INTEGER, // <-- UBAH KE DataTypes.INTEGER
    //   allowNull: false,
    //   defaultValue: 0,
    // },
    createdAt: {
      type: DataTypes.DATE, // <-- UBAH KE DataTypes.DATE
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE, // <-- UBAH KE DataTypes.DATE
      allowNull: false,
    },
  },
  {
    tableName: "Products", // <-- UBAH KE "Products" (sesuai migrasi Anda)
    timestamps: true, // Enable timestamps for createdAt and updatedAt
  }
);

module.exports = Product;
