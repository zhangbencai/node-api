
//数据库的连接与操作
const mongoose = require('mongoose')

//连接数据库
mongoose.connect('mongodb://localhost/my2002',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})

//监听数据库连接是否成功
const db = mongoose.connection
db.on('open',function(){
    console.log('数据库连接成功')
})
db.on('error',function(){
    console.log('数据库连接失败')
})