const { Pool } = require("pg");
require('dotenv').config();

module.exports = new Pool({
  connectionString: process.env.DATABASE_URL
  // host: process.env.DB_HOST, // or wherever the db is hosted
  // user: process.env.DB_USER,
  // database: process.env.DB_NAME,
  // port: process.env.DB_PORT // The default port
});