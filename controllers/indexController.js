const db = require("../db/queries")
const { body, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 50 characters.";
const numErr = "must be a year after 1950."

const validateUser = [
    body("gameName").trim()
    .isLength({ min: 1, max: 50 }).withMessage(`Game name ${lengthErr}`),
    body("yearPublished").trim()
    .isInt({ min: 1950 }).withMessage(`Year ${numErr}`)
]

async function getGames(req, res) {
    const games = await db.retrieveGames();
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
    res.render("allGenres", { genres: genres });
}

async function showGenre(req, res) {
    const thisGenre = req.params.genreId;
    const gameDetails = await db.getGenre(thisGenre);

    if(gameDetails[0] == null) {
        res.redirect('/404');
    }
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
        res.redirect('/noDevs');
    }
    res.render("gamesByGenreDev", { title: gameDetails[0].developers[0], games: gameDetails })
}

async function newGameForm(req, res) {
    const genres = await db.getGenres();
    res.render('form', { genres: genres })
}

const newGame = [
    validateUser,
    async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const genres = await db.getGenres();
      return res.status(400).render("form", {
        errors: errors.array(),
        genres: genres
      });
    }

    //****add a CHECK GAME function here to exit if game already exists
    
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
]

async function editGameForm(req, res) {
    const gameId = req.params.gameId;
    const game = await db.findGame(gameId);
    const genres = await db.getGenres();

    if(game[0] == null) {
        res.redirect('/404');
    }

    res.render('editGame', { game: game, genres: genres })
}

const editGame = [ 
    validateUser,
    async(req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const gameId = req.body.gameHiddenId;
      const game = await db.findGame(gameId);
      const genres = await db.getGenres();
      return res.status(400).render("editGame", {
        errors: errors.array(),
        game: game,
        genres: genres
      });
    }

    let gameName = req.body.gameName;
    let gameYr = req.body.yearPublished;
    let genreArr = req.body.genre;
    let gameDev = req.body.gameDeveloper;
    let cover = req.body.coverArt;
    let gameId = req.body.gameHiddenId;

    if(cover == '') {
        cover = 'vid image';
    }

    //check if dev exists, if not, add
    await db.checkDev(gameDev)

    //edit the game
    await db.editGameDetails(gameId, gameName, gameYr, cover)

    //delete old genre links
    await db.linkGenresDeleteEdit(gameId)

    //add new genre links
    for(const id of genreArr) {
        await db.linkGenresEdit(gameId, id)
    }

    //add/delete new dev links
    await db.linkDevsEdit(gameId, gameDev)

    res.redirect('/')
}
]

async function deleteGame (req, res) {
    const gameId = req.params.gameId;    
    await db.eraseGame(gameId);

    res.redirect('/');
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
    editGame,
    deleteGame
}

