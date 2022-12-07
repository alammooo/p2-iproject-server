const Controller = require("../controllers/controller")
const { userConsent } = require("../middlewares/authentication")
const router = require("express").Router()

router.get("/covid-data", Controller.getCovidData)
router.post("/register", Controller.userRegsiter)
router.post("/login", Controller.userLogin)

router.use(userConsent)

router.post("/favorites", Controller.addFavorites)
router.get("/favorites", Controller.findFavorites)
router.delete("/favorites", Controller.deleteFavorites)

module.exports = router
