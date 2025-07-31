const { check } = require("express-validator");
const pool = require("./pool")

async function retrieveGames() {
    const { rows } = await pool.query(`
        SELECT video_games.id, video_games.name, video_games.year, video_games.cover, ARRAY_AGG(DISTINCT genres.genre) AS genres, ARRAY_AGG(DISTINCT developers.developer) AS developers
        FROM video_games
        INNER JOIN games_genres
        ON video_games.id = games_genres.game_id
        INNER JOIN genres
        ON games_genres.genre_id = genres.id
        INNER JOIN games_devs
        ON video_games.id = games_devs.game_id
        INNER JOIN developers
        ON games_devs.dev_id = developers.id
        GROUP BY video_games.id, video_games.name, video_games.year, video_games.cover
        ORDER BY video_games.year`) 
    console.log("games are: ", rows);
    return rows;
}

async function findGame(gameId) {
    console.log("the id is: ", gameId)
    const { rows } = await pool.query(`
        SELECT video_games.id, video_games.name, video_games.year, video_games.cover, ARRAY_AGG(DISTINCT genres.genre) AS genres, ARRAY_AGG(DISTINCT developers.developer) AS developers
        FROM video_games
        INNER JOIN games_genres
        ON video_games.id = games_genres.game_id
        INNER JOIN genres
        ON games_genres.genre_id = genres.id
        INNER JOIN games_devs
        ON video_games.id = games_devs.game_id
        INNER JOIN developers
        ON games_devs.dev_id = developers.id
        WHERE CAST(video_games.id as VARCHAR) LIKE $1
        GROUP BY video_games.id, video_games.name, video_games.year, video_games.cover
        `, [gameId])
    console.log("rows: ", rows)
    return rows;
        // "SELECT * FROM messages WHERE CAST(id as VARCHAR) LIKE $1", [messageId])
}

async function getGenres() {
    const { rows } = await pool.query(`
        SELECT genre, id
        FROM genres
        `)
    console.log(rows)
    return rows;
}

async function getGenre(genreId) {
    const { rows } = await pool.query(`
        SELECT video_games.id, video_games.name, video_games.year, video_games.cover, ARRAY_AGG(DISTINCT genres.genre) AS genres, ARRAY_AGG(DISTINCT developers.developer) AS developers
        FROM video_games
        INNER JOIN games_genres
        ON video_games.id = games_genres.game_id
        INNER JOIN genres
        ON games_genres.genre_id = genres.id
        INNER JOIN games_devs
        ON video_games.id = games_devs.game_id
        INNER JOIN developers
        ON games_devs.dev_id = developers.id
        WHERE CAST(genres.id as VARCHAR) LIKE $1
        GROUP BY video_games.id, video_games.name, video_games.year, video_games.cover
        `, [genreId])
    return rows;
}

async function getDevelopers() {
    const { rows } = await pool.query(`
        SELECT developer, id
        FROM developers
        `)
    return rows;
}

async function getDeveloper(developerId) {
    const { rows } = await pool.query(`
        SELECT video_games.id, video_games.name, video_games.year, video_games.cover, ARRAY_AGG(DISTINCT genres.genre) AS genres, ARRAY_AGG(DISTINCT developers.developer) AS developers
        FROM video_games
        INNER JOIN games_genres
        ON video_games.id = games_genres.game_id
        INNER JOIN genres
        ON games_genres.genre_id = genres.id
        INNER JOIN games_devs
        ON video_games.id = games_devs.game_id
        INNER JOIN developers
        ON games_devs.dev_id = developers.id
        WHERE CAST(developers.id as VARCHAR) LIKE $1
        GROUP BY video_games.id, video_games.name, video_games.year, video_games.cover
        `, [developerId])
    return rows;
}

async function addGame(name, year, cover) {
    await pool.query("INSERT INTO video_games (name, year, cover) VALUES ($1, $2, $3)", [name, year, cover])
}

async function checkDev(dev) {
    //check if dev exists in database
    //if not, add to developers db
    const { rows } = await pool.query("SELECT developer FROM developers")
    console.log(rows)

    //this didn't work with foreach because that is a function
    //so the return was only exiting that then adding to db anyways
    for (let i=0; i<rows.length; i++) {
        if (rows[i].developer == dev) {
            return;
        }
    }

    await pool.query("INSERT INTO developers (developer) VALUES ($1)", [dev])
}

async function linkGenres(genre) {
    const { rows } = await pool.query("SELECT MAX(video_games.id) FROM video_games")
    const gameId = rows[0].max.toString();
    console.log(gameId)
    await pool.query("INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2)", [gameId, genre])   
}

async function linkDevs() {

}

module.exports = {
    retrieveGames,
    findGame,
    getGenres, 
    getGenre,
    getDevelopers,
    getDeveloper,
    addGame,
    linkGenres,
    checkDev,
    linkDevs
}