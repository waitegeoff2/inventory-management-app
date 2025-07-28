const pool = require("./pool")

async function retrieveGames() {
    // const { rows } = await pool.query(SELECT STATEMENT WITH INNER JOINS to RETURN game info, genre info, dev info)
    //need to include a GROUP BY???? so that only the name shows up once with the corresponding other ones
    
    console.log("games are: ", rows);
    return rows;
}