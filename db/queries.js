const pool = require("./pool")

async function retrieveGames() {
    const { rows } = await pool.query("SELECT * FROM games")
    console.log("games are: ", rows);
    return rows;
}