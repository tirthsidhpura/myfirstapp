const mongoose = require('mongoose')

const addBLOGSchema = new mongoose.Schema({
    title:String,
    image:String,
    date:{type: Date, default: Date.now().toString()},
    description:String
})

module.exports = mongoose.model('addblog',addBLOGSchema)