"use strict";
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Hash passwords before inserting them
    const hashedPassword1 = bcrypt.hashSync("password123", 10);
    const hashedPassword2 = bcrypt.hashSync("password123", 10);
    const hashedPassword3 = bcrypt.hashSync("password123", 10);

    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await queryInterface.bulkInsert(
      "Pengguna",
      [
        {
          nama: "Jahfal Admin",
          email: "admin@example.com",
          password: hashedPassword1,
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "User1",
          email: "user1@example.com",
          password: hashedPassword2,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama: "User2",
          email: "user2@example.com",
          password: hashedPassword3,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Pengguna", null, {});
  },
};
