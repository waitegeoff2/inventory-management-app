const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")

//home page
indexRouter.get('/', indexController.getGames)

//get game based on ID
indexRouter.get('/games/:gameId', indexController.getGameInfo)

//genres

indexRouter.get('/genres', indexController.showGenres)
indexRouter.get('/genres/:genreId', indexController.showGenre)

//developers

indexRouter.get('/devs', indexController.showDevelopers)
indexRouter.get('/devs/:developerId', indexController.showDeveloper)

//new game
indexRouter.get('/new', (req, res) => res.render('form'))
// indexRouter.post('/new', indexController)

//404
indexRouter.get('/404', (req, res) => res.render('404'))

//new game form (get to render form, POST to update game db)

//browse by genre

//browse by dev

module.exports = indexRouter;