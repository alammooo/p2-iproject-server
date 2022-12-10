const Controller = require("../controllers/controller")
const { userConsent } = require("../middlewares/authentication")
const router = require("express").Router()
const multer = require("multer")
const upload = multer({ dest: "uploads/" })

router.get("/covid-data", Controller.getCovidData)
router.post("/register", Controller.userRegister)
router.post("/login", Controller.userLogin)
router.post("/google-login", Controller.authGoogleLogin)

router.use(userConsent)

router.post("/favorites", Controller.addFavorites)
router.get("/favorites", Controller.findFavorites)
router.delete("/favorites/:id", Controller.deleteFavorites)
router.post("/user-detail", Controller.postUserDetail)
router.get("/user-detail", Controller.getUserDetail)

router.put("/user-detail", upload.single("avatar"), Controller.putUserDetail)

module.exports = router
