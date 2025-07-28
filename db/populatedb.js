const { Client } = require("pg");
require('dotenv').config();

const SQL = `
CREATE TABLE IF NOT EXISTS video_games (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR ( 255 ),
    year INT,
    cover VARCHAR ( 2048 )
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
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER REFERENCES video_games(id),
    genre_id INTEGER REFERENCES genres(id)
);

CREATE TABLE IF NOT EXISTS games_devs (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    game_id INTEGER REFERENCES video_games(id),
    dev_id INTEGER REFERENCES developers(id)
);

INSERT INTO video_games (name, year, cover)
VALUES
    ('Dark Souls', '2011', 'https://cdn.thegamesdb.net/images/original/boxart/front/7752-1.jpg'),
    ('The Legend of Zelda: The Wind Waker', '2003', 'https://cdn.thegamesdb.net/images/original/boxart/front/129800-1.jpg'),
    ('Elden Ring', '2022', 'https://cdn.thegamesdb.net/images/original/boxart/front/72163-1.jpg'), 
    ('007: Nightfire', '2002', 'https://cdn.thegamesdb.net/images/original/boxart/front/5428-1.jpg'),
    ('Shenmue', '2000', 'https://cdn.thegamesdb.net/images/original/boxart/front/62809-1.jpg'),
    ('Kingdom Come: Deliverance 2', '2025', 'https://cdn.thegamesdb.net/images/original/boxart/front/126214-1.jpg'),
    ('NBA 2K9', '2008', 'https://cdn.thegamesdb.net/images/original/boxart/front/14334-1.jpg'),
    ('Resident Evil 4', '2005', 'https://cdn.thegamesdb.net/images/original/boxart/front/89870-1.jpg'),
    ('Spelunky 2', '2020', 'https://cdn.thegamesdb.net/images/original/boxart/front/96166-1.jpg'),
    ('Hotline Miami', '2012', 'https://cdn.thegamesdb.net/images/original/boxart/front/13958-1.jpg');

INSERT INTO genres (genre)
VALUES
('FromSoftware'),
('Nintendo'),
('Electronic Arts'),
('Eurocom'),
('Sega'),
('Warhorse'),
('2K'),
('Visual Concepts'),
('Capcom'),
('Moss Mouth'),
('Blitworks'),
('Denton');

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