require('dotenv').config()
const express = require('express')
const app = express()
const db = require('./db/db.js')
const nodemailer = require('nodemailer')
const session = require('express-session')
// const fileupload = require('express-fileupload')
// const productcontroller = require('./controller/productcontroller')
const userrouter = require('./routes/user')
const adminrouter = require('./routes/admin')
const flash = require('express-flash')


app.set('view engine','ejs')
app.set("views","views")
app.use(express.static("public"))

app.use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: false, // Correct the option name
    cookie: { maxAge: 1000 * 60 * 60 }
}))

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    next();
  });

// app.use(fileupload())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(flash())

app.use("/",userrouter)
app.use("/admin",adminrouter)

app.listen(process.env.PORT ,()=> {
    console.log("server connected");
})
