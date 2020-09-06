const mongoose = require('mongoose')

//创建一个Schema
//这个model是用来做增删改查
module.exports = mongoose.model('users',mongoose.Schema({
    username:String,
    password:String,
    create_time:Number
}))