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
    console.log(genres)
    res.render("allGenres", { genres: genres });
}

async function showGenre(req, res) {
    const thisGenre = req.params.genreId;
    const gameDetails = await db.getGenre(thisGenre);

    if(gameDetails[0] == null) {
        res.redirect('/404');
    }
    console.log(gameDetails)
    res.render("gamesByGenreDev", { title: gameDetails[0].genres[0], games: gameDetails })
}

async function showDevelopers(req, res) {
    const devs = await db.getDevelopers();
    res.render("allDevs", { devs: devs });
}

async function showDeveloper(req, res) {
    const thisDev = req.params.developerId;
    const gameDetails = await db.getDeveloper(thisDev);

    if(gameDetails[0] == null) {
        res.redirect('/404');
    }
    console.log(gameDetails)
    res.render("gamesByGenreDev", { title: gameDetails[0].developers[0], games: gameDetails })
}

async function newGame(req, res) {
    console.log(req.body)
    //send to db and update the games section
    res.end();
    //REDIRECT TO HOMEPAGE WHERE YOU CAN SEE NEW GAME
}

module.exports = {
    getGames,
    getGameInfo,
    showGenres,
    showGenre, 
    showDevelopers,
    showDeveloper,
    newGame
}

