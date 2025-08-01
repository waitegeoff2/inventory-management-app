const db = require("../db/queries")
const pool = require("../db/pool")

async function getGames(req, res) {
    const games = await db.retrieveGames();
    console.log(games)
    // res.send(games)
    res.render("index", { title: "Game Library", games: games })
}

async function getGameInfo(req, res) {
    const thisGameId = req.params.gameId;
    //find that message in database and return it
    const game = await db.findGame(thisGameId)
    console.log(game)

    if(game[0] == null) {
        res.redirect('/404');
    }

    res.render("gameDetails", { game: game })
}

async function showGenres(req, res) {
    const genres = await db.getGenres();
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

async function newGameForm(req, res) {
    const genres = await db.getGenres();
    res.render('form', { genres: genres })
}

async function newGame(req, res) {

    //****add a CHECK GAME function here to exit if game exists
    
    let gameName = req.body.gameName;
    let gameYr = req.body.yearPublished;
    let genreArr = req.body.genre;
    let developer = req.body.gameDeveloper;
    let coverArt = req.body.coverArt;

    //if cover art not added, add generic image
    if(coverArt == '') {
        coverArt = 'vid image';
    }

    //check if dev exists, if not, add
    await db.checkDev(developer)

    //add game to database
    await db.addGame(gameName, gameYr, coverArt);

    //update the links between games and genres
    for(const id of genreArr) {
        await db.linkGenres(id)
    }

    //update link between game and dev
    await db.linkDevs(developer)
    
    res.redirect('/');
}

//update game USE SAME FORM
async function editGameForm(req, res) {
    const gameId = req.params.gameId;
    const game = await db.findGame(gameId);
    const genres = await db.getGenres();

    if(game[0] == null) {
        res.redirect('/404');
    }

    console.log(game)
    console.log(genres)

    res.render('editGame', { game: game, genres: genres })

}

async function editGame(req, res) { 
    console.log(req.body)

    res.end()
}

module.exports = {
    getGames,
    getGameInfo,
    showGenres,
    showGenre, 
    showDevelopers,
    showDeveloper,
    newGameForm,
    newGame, 
    editGameForm,
    editGame
}

