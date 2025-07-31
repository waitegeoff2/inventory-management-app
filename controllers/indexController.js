const db = require("../db/queries")
const pool = require("../db/pool")

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

    //add a CHECK GAME function here to exit if game exists
    
    let gameName = req.body.gameName;
    let gameYr = req.body.yearPublished;
    let genreArr = req.body.genre;
    let developer = req.body.gameDeveloper;
    let coverArt = req.body.coverArt;

    console.log(coverArt, gameName, genreArr, gameYr, developer)

    if(coverArt == '') {
        coverArt = 'vid image';
    }

    //check if dev exists, if not, add
    await db.checkDev(developer)

    console.log(developer)
    //add game to database
    await db.addGame(gameName, gameYr, coverArt);

    //update the links between games and genres
    for(const id of genreArr) {
        await db.linkGenres(id)
    }

    await db.linkDevs(developer)

    //link the game and developer databases
    
    res.end();
    // res.redirect('/');
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

