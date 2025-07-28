const { Client } = require("pg");
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS video_games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ),
    description VARCHAR ( 255 ),
    year INT,
);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre VARCHAR ( 255 ),   
);

CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    developer VARCHAR ( 255 ),
);



`;

async function main() {
  console.log("seeding...");
  const client = new Client({
    host: process.env.DB_HOST, // or wherever the db is hosted
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT // The default port
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("done");
}

main();