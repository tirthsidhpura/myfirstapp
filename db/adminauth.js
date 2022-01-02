const mongoose = require('mongoose')

const adminScehma = mongoose.Schema({
    username :{
        type:String,
        required:true
    },
    password:{
        type :String,
        required:true
    }
})

module.exports = mongoose.model('adminauth',adminScehma)