const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")

//home page
indexRouter.get('/', indexController.getGames)

//genres

indexRouter.get('/genres', indexController.showGenres)
indexRouter.get('/genres/:genreId', indexController.showGenre)

//developers

indexRouter.get('/devs', indexController.showDevelopers)
indexRouter.get('/devs/:developerId', indexController.showDeveloper)

// indexRouter.get('/devs')

//GAME ID
indexRouter.get('/games/:gameId', indexController.getGameInfo)

//new game form (get to render form, POST to update game db)

//browse by genre

//browse by dev

module.exports = indexRouter;