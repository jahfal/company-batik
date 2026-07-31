"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Products", { // Changed table name from "Lapangan" to "Products"
      id_product: { // Changed primary key name
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { // Product name
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: { // Product description
        type: Sequelize.TEXT, // Use TEXT for potentially longer descriptions
        allowNull: true, // Description can be optional
      },
      price: { // Product price
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      category: { // Product category (e.g., "electronics", "clothing", "books")
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      image_url: { // URL for product image
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      // stock: { // Available stock
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   defaultValue: 0,
      // },
      tokopedia_url: {
        type: Sequelize.STRING(255),
        allowNull: true, // Link bisa saja opsional
      },
      shopee_url: {
        type: Sequelize.STRING(255),
        allowNull: true, // Link bisa saja opsional
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Products"); // Changed table name from "Lapangan" to "Products"
  },
};