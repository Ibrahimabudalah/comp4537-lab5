require("dotenv").config();

const mysql = require("mysql2/promise");
const fs = require("node:fs");
const path = require("node:path");

class DatabaseConfig {
  constructor() {
    this.config = {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,

      ssl: {
        ca: fs.readFileSync(path.join(__dirname, "ca.pem")),
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
      },

      waitForConnections: true,
      connectionLimit: 5,
      multipleStatements: false,
    };
  }

  createWriter() {
    return mysql.createPool({
      ...this.config,
      user: process.env.DB_WRITER_USER,
      password: process.env.DB_WRITER_PASSWORD,
    });
  }

  createReader() {
    return mysql.createPool({
      ...this.config,
      user: process.env.DB_READER_USER,
      password: process.env.DB_READER_PASSWORD,
    });
  }
}

module.exports = DatabaseConfig;
