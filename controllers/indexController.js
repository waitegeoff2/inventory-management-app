const db = require("../db/queries")

async function getGames(req, res) {
    const games = await db.retrieveGames();
    // res.send(games)
    res.render("index", { title: "Game Library", games: games })
}

async function getGameInfo(req, res) {
    const thisGameId = req.params.gameId;
    //find that message in database and return it
    const game = await db.findGame(thisGameId)

    if(game[0] == null) {
        res.redirect('/404');
    }

    res.render("gameDetails", { game: game })
}

async function showGenres(req, res) {
    const genres = await db.getGenres();
    res.send(genres);
}

module.exports = {
    getGames,
    getGameInfo,
    showGenres
}

