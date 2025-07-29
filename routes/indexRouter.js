const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")

//home page
indexRouter.get('/', indexController.getGames)

// indexRouter.get('/genres')

// indexRouter.get('/devs')

//GAME ID
indexRouter.get('/games/:gameId', indexController.getGameInfo)

//new game form (get to render form, POST to update game db)

//browse by genre

//browse by dev

module.exports = indexRouter;