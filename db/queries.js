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

module.exports = {
    retrieveGames,
    findGame
}