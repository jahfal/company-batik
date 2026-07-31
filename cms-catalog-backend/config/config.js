require("dotenv").config();

module.exports = {
  // development: {
  //   username: "root",
  //   password: "",
  //   database: "cms_catalog_db",
  //   host: "127.0.0.1",
  //   dialect: "mysql",
  //   // logging: false, // Disable logging in development
  // },

    development: {
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || "cms_catalog_db",
    host: process.env.DB_HOST || "localhost", // This line needs to be updated to use the environment variable
    dialect: "mysql",
    logging: console.log,
  },
  
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
  },
};
