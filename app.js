
const express = require('express')
const auth = require('./routes/auth.route')
const home = require('./routes/home.route')
var cookieParser = require('cookie-parser');


const app = express()
const fileUpload = require('express-fileupload')

app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(fileUpload())
app.use(cookieParser());
app.use(express.static(process.cwd() + "/uploads"))
app.set('view engine', 'ejs')
app.use("/auth", auth)
app.use("/", home)

app.listen(5000, ()=> {
    console.log(5000);
})
