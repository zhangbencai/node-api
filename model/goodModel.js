const mongoose = require ('mongoose')

module.exports = mongoose.model('goods',mongoose.Schema({
    name:String,
    desc:String,
    price:Number,
    cate:String,
    img:String,
    hot:Boolean,
    rank:Number,
    create_time:Number
}))