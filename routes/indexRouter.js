const { Router } = require("express");
const indexRouter = Router();

//home page
indexRouter.get('/', (req,res) => {
    res.end("display games here")
})

//new game form (get to render form, POST to update game db)

//browse by genre

//browse by dev

module.exports = indexRouter;