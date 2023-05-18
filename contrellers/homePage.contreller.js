const Io = require('../utils/io')
const Users = new Io("./db/users.json")
const Posts = new Io("./db/posts.json")
const Post = require("../models/post")
const jwt = require("../utils/jwt");
const {v4 } = require("uuid")
exports.home = (req,res)=> {
    res.render("index")
}

exports.posts = (req,res)=> {
    res.render("PostsPage")
}

exports.addpost = (req,res)=> {
    res.render("AddPost")
}
exports.editpost = async(req,res)=> {
    const {id} = req.params
    const posts = await Posts.read()
    const post = posts.find(p=> p.id === id)
    res.render("EditPage", {
        post
    })
}

exports.getProfiles = async(req,res)=> {
    const users = await Users.read()
    const arrUsers = []
    for (let i = 0; i < users.length; i++) {
        const obj = {username: users[i].username, image: users[i].image, id: users[i].id}
        arrUsers.push(obj) 
    } 
    res.status(200).json(arrUsers)
}

exports.getProfile = async(req,res)=> {
    const {id} = req.params
    const users = await Users.read()
    const posts = await Posts.read()
    const cookie = req.cookies.token
    const verifyToken = jwt.verify(cookie);
    const findUser = users.find(u=> u.id === id)
    const findPosts = posts.filter(p=> p.user_id === id)
    if (!findUser) {
        return res.status(404).json({message: "User not found"})
    }
    if (findUser.id === verifyToken.id) {
        const findPosts = posts.filter(p=> p.user_id === verifyToken.id)
       return  res.render("ProfileMePage", {
            findUser,
            findPosts 
            
        })
    }
    res.render("ProfilePage", {
        findUser,
        findPosts
    })
}

exports.getPosts = async(req,res)=> {
    const posts = await Posts.read()
    const newPosts = []
    for (let i = 0; i < posts.length; i++) {
        const obj = {title: posts[i].title, image: posts[i].image, text: posts[i].text, id: posts[i].id}
        newPosts.push(obj)
    }
    res.status(200).json(newPosts.length ? newPosts : {message: "No more posts..."})
}



exports.AddPost = async(req, res)=> {
    const users = await Users.read()
    const posts = await Posts.read()
    const cookie = req.cookies.token
    const verifyToken = jwt.verify(cookie);
    const findUser = users.find(u=> u.id === verifyToken.id)
    const {image} = req.files
    const {title, text} = req.body
    const photo = `${v4()}.${image.mimetype.split("/")[1]}`
    const id = v4()
    const newPosts = new Post(
        title,
        id,
        findUser.id,
        photo,
        text
    )
    const data = posts.length ? [...posts, newPosts] : [newPosts]
    Posts.write(data)
  image.mv(`${process.cwd()}/uploads/${photo}`);
    res.status(200).json({message: "Added post"})
}

exports.EditPost = async(req, res)=> {
    const posts = await Posts.read()
    const {id} = req.params
    const image = req.files
    const {title, text} = req.body
    const findPost = posts.find(p=> p.id === id)
    const photo = image ? `${v4()}.${image.image.mimetype.split("/")[1]}` : false
    findPost.image = photo ? photo : findPost.image
    findPost.title = title ? title : findPost.title
    findPost.text =  text ? text : findPost.text
    photo ?  image.image.mv(`${process.cwd()}/uploads/${photo}`) : false

    Posts.write(posts)
    res.status(200).json({message: "Updated"})
}


exports.deleteProfile = async(req,res)=> {
    const cookie = req.cookies.token
    const verifyToken = jwt.verify(cookie);
    const users = await Users.read()
    const posts = await Posts.read()
    const findUser = users.filter(u=> u.id !== verifyToken.id)
    const findPosts = posts.filter(p=> p.user_id !== verifyToken.id)
    Users.write(findUser)
    Posts.write(findPosts)
    res.clearCookie("token").status(200).json({message: "Deleted"})
}

exports.deletePost = async(req, res)=> {
   try {
    const {id} = req.params
    const posts = await Posts.read()
    const findPost = posts.filter(p=> p.id !== id)
    Posts.write(findPost)
    res.status(200).json({message: "Deleted"})
   } catch (error) {
    res.status(500).json({error:    error.message})
   }
}