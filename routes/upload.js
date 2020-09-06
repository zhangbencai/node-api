var express = require('express');
var router = express.Router();
var multiparty = require('multiparty');
var path = require('path')
var fs = require('fs')

router.post('/img',function(req,res){
    // 创建一个实例
    var from = new multiparty.Form()
    // form.parse方法的作用：把req中的图片数据转存到服务器临时存储路径中去
    from.parse(req,function(err,fields,files){
        if(err){
            res.json({err:1,msg:'图片上传失败'})
        }else{
            console.log('aaaaa',files)
            const file = files.file[0]
             // 使用fs模块把临时路径中的图片数据，写入到服务器硬盘中
            let readStream = fs.createReadStream(file.path)

            let now = Date.now()
            let p = path.join(__dirname,'../public/images/'+now+'-'+file.originalFilename)
            let writeStream = fs.createWriteStream(p)

            readStream.pipe(writeStream)

            writeStream.on('close',function(){
                let data = {
                    url: `/images/${now}-${file.originalFilename}`
                }
                res.json({err:0,msg:'图片上传成功',data})
            })
        }
    });
});

module.exports = router;