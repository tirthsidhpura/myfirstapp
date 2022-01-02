const express = require('express')
const app = express()
const session = require('express-session')
const mongoDBSession = require('connect-mongodb-session')(session)
const client = require('./routes/client')
const admin = require('./routes/admin')
const adminauth = require('./routes/adminauth')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
require('dotenv').config();


const DB = process.env.DATABASE;

mongoose.connect( DB, { useNewUrlParser: true ,useUnifiedTopology: true , useFindAndModify: false  })
.then(()=>console.log("db connected"))
.catch((err)=>console.log(err))


const mongoURI = 'mongodb://localhost:27017/testtwelve'
const store = mongoDBSession({
    uri : mongoURI,
    collection : 'mySessions'
})

app.use(session({
    secret:"this is a secret",
    resave:false,
    saveUninitialized:false,
    store:store
}))

const port = process.env.PORT || 5000;

app.use(bodyparser.urlencoded({extended:true}))
app.set('view engine','ejs')
app.use(express.static('public'))

app.use(client)
app.use(adminauth)
app.use(admin)
app.listen(port)
