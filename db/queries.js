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
    return rows;
        // "SELECT * FROM messages WHERE CAST(id as VARCHAR) LIKE $1", [messageId])
}

async function getGenres() {
    const { rows } = await pool.query(`
        SELECT genre, id
        FROM genres
        `)
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

    //this didn't work with foreach because that is a function so returns exits just that
    for (let i=0; i<rows.length; i++) {
        // need to turn both of these variable into TRIMMED AND LOWER CASE
        if (rows[i].developer == dev) {
            return;
        }
    }

    await pool.query("INSERT INTO developers (developer) VALUES ($1)", [dev])
}

async function linkGenres(genre) {
    const { rows } = await pool.query("SELECT MAX(video_games.id) FROM video_games")
    const gameId = rows[0].max.toString();
    await pool.query("INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2)", [gameId, genre])   
}

async function linkGenresDeleteEdit(gameId) {
    await pool.query("DELETE FROM games_genres WHERE game_id=$1", [gameId])
}

async function linkGenresEdit(gameId, genre) {
    await pool.query("INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2)", [gameId, genre])
}

async function linkDevs(dev) {
    //query to find the id of this developer and the most recently added game
    const { rows } = await pool.query("SELECT developers.id FROM developers WHERE developer=($1)", [dev])
    const gameValue = await pool.query("SELECT MAX(video_games.id) FROM video_games")
    const devId = rows[0].id.toString();
    const gameId = gameValue.rows[0].max.toString();

    //add values into db linking game id with dev id
    await pool.query("INSERT INTO games_devs (game_id, dev_id) VALUES ($1, $2)", [gameId, devId]) 

}

async function linkDevsEdit(gameId, dev) {
    const { rows } = await pool.query("SELECT developers.id FROM developers WHERE developer=($1)", [dev])
    const devId = rows[0].id.toString();
    await pool.query("DELETE FROM games_devs WHERE game_id=$1", [gameId])
    await pool.query("INSERT INTO games_devs (game_id, dev_id) VALUES ($1, $2)", [gameId, devId]) 
}

async function editGameDetails(id, name, year, cover) {
    console.log(id, name, year, cover)
    await pool.query("UPDATE video_games SET name=$1, year=$2, cover=$3 WHERE id=$4", [name, year, cover, id])
}

async function eraseGame(gameId) {
    await pool.query("DELETE FROM video_games WHERE id=$1", [gameId])
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
    linkDevs,
    editGameDetails, 
    linkGenresEdit,
    linkDevsEdit,
    linkGenresDeleteEdit,
    eraseGame
}