const { Client } = require("pg");
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS video_games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ),
    year INT,
    cover VARCHAR ( 2048 )
);

INSERT INTO video_games (name, description, year) (
    ('Dark Souls', '2011', 'https://cdn.thegamesdb.net/images/original/boxart/front/7752-1.jpg'),
    ('The Legend of Zelda: The Wind Waker', '2003', 'https://cdn.thegamesdb.net/images/original/boxart/front/129800-1.jpg'),
    ('Elden Ring', '2022', 'https://cdn.thegamesdb.net/images/original/boxart/front/72163-1.jpg'), 
    ('007: Nightfire', '2002', 'https://cdn.thegamesdb.net/images/original/boxart/front/5428-1.jpg'),
    ('Shenmue', '2000', 'https://cdn.thegamesdb.net/images/original/boxart/front/62809-1.jpg'),
    

);

CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    genre VARCHAR ( 255 ),   
);

CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    developer VARCHAR ( 255 ),
);

CREATE TABLE IF NOT EXISTS games_genres (

);

CREATE TABLE IF NOT EXISTS games_devs (

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