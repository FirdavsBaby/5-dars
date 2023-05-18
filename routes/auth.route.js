const {Router} = require("express")
const {login, register, signup, signin} = require("../contrellers/auth.contreller")
const router = Router()

router.get("/login", login)
router.get("/register", register)

router.post("/signup", signup)

router.post("/signin", signin)

router.get("/*", (req, res)=> {
    res.redirect("https://www.youtube.com/channel/UCCUl3I6R76p1yGRujSG9pnA")
})

module.exports = router