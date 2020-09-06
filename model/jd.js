var mongoose = require('mongoose')

module.exports = mongoose.model('goods', mongoose.Schema({
  img: String,   // 图片
  name: String,  // 商品名称
  desc: String,  // 商品描述
  price: Number, // 价格
  cate: String,  // 品类
  hot: Boolean,  // 是否推荐
  rank: Number,   // 排名，先后顺序
  create_time: Number
}))

module.exports = mongoose.model('cates', mongoose.Schema({
  rank: Number, // 排序
  cate: String, // 英文字段
  cate_zh: String  // 中文字符
}))


var userModel = mongoose.model('users', mongoose.Schema({
  username: String,
  password: String,
  createTime: Number
}))
