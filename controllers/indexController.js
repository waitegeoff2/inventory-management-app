const db = require("../db/queries")

async function getGames(req, res) {
    // const games = await db.retrieveGames();
    res.render("index", { title: "Game Library", games: games });
}