const User = require('../models/user')
const Io = require('../utils/io')
const Users = new Io("./db/users.json")
const {v4} = require('uuid')
const {hash, compare} = require('bcrypt')
const jwt = require('../utils/jwt')
exports.login = (req,res)=> {
    res.render("LoginPage");
}

exports.register = (req,res)=> {
    res.render("RegisterPage");
}

exports.signup = async(req,res)=> {
    try {
        const users = await Users.read()
   const {username, password} = req.body
   const {image} = req.files
    const checkUser = users.find(u=> u.username === username)
    if(checkUser) {
        return res.status(403).json({message: "Username already exists"})
    }
    const hashPassword = await hash(password, 12) 
    const photo = `${v4()}.${image.mimetype.split("/")[1]}`
    const id = v4()
    const newUser = new User(
        id,
        username,
        hashPassword,
        photo
    )
    const data = users.length ? [...users, newUser] : [newUser]
  image.mv(`${process.cwd()}/uploads/${photo}`);
    Users.write(data)
    return res.cookie("token", jwt.sign({id})).json({message: "Success"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

exports.signin = async(req,res)=> {
    try {
    const users = await Users.read()
    const {username, password} = req.body
    const checkUser = users.find(u=> u.username === username)
    const comparePassword = compare(password, checkUser.password)
    if(!checkUser || !comparePassword) {
        return res.status(403).json({message: "Forbidden"})
    }
    return res.cookie("token", jwt.sign({id: checkUser.id})).json({message: "Success"})
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}