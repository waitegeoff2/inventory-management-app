const { Router } = require("express");
const indexRouter = Router();
const indexController = require("../controllers/indexController")

//home page
indexRouter.get('/', indexController.getGames)

//new game form (get to render form, POST to update game db)

//browse by genre

//browse by dev

module.exports = indexRouter;