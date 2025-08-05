const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")

//home page
indexRouter.get('/', indexController.getGames)

//get game based on ID
indexRouter.get('/games/:gameId', indexController.getGameInfo)

//browse by genres
indexRouter.get('/genres', indexController.showGenres)
indexRouter.get('/genres/:genreId', indexController.showGenre)

//browse by developers
indexRouter.get('/devs', indexController.showDevelopers)
indexRouter.get('/devs/:developerId', indexController.showDeveloper)

//new game
indexRouter.get('/new', indexController.newGameForm)
indexRouter.post('/new', indexController.newGame)

//edit game
indexRouter.get('/edit/:gameId', indexController.editGameForm)
indexRouter.post('/edit/:gameId', indexController.editGame)

//delete game
indexRouter.get('/delete/:gameId', indexController.deleteGame)

//404
indexRouter.get('/404', (req, res) => res.render('404'))

module.exports = indexRouter;