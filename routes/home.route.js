const {Router} = require("express")
const {home, getProfiles, getProfile, posts, getPosts, AddPost, addpost, deleteProfile, EditPost, editpost, deletePost} = require("../contrellers/homePage.contreller")
const isAuth = require("../utils/middleware")
const router = Router()

router.get("/", home)
router.get("/posts", posts)
router.get("/posts/addPost", addpost)
router.get("/posts/editPost/:id",  editpost)

router.get("/profiles", isAuth ,getProfiles)
router.get("/profile/:id" ,getProfile)
router.get("/posts/allposts", isAuth ,getPosts)
router.post("/posts/addPost", isAuth ,AddPost)
router.delete("/profile/remove/:id", isAuth ,deleteProfile)
router.put("/posts/editPost/:id", isAuth , EditPost)
router.delete("/posts/deletePost/:id", isAuth , deletePost)
// router.get("/*", (req, res)=> {
//     res.redirect("https://www.youtube.com/channel/UCCUl3I6R76p1yGRujSG9pnA")
// })

module.exports = router