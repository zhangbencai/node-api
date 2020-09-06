var express = require('express')
var router = express.Router();
var goodModel = require('../model/goodModel');

//商品新增、编辑
router.post('/cms/create', function(req, res, next) {
    let { img, name, desc, price, cate, hot, rank, id } = req.body

    if(!img) return res.json({err:-1, msg:'img是必填参数'})
    if(!name) return res.json({err:-1, msg:'name是必填参数'})
    if(!desc) return res.json({err:-1, msg:'desc是必填参数'})
    if(!price) return res.json({err:-1, msg:'price是必填参数'})
    if(!cate) return res.json({err:-1, msg:'cate是必填参数'})

    hot = hot || false
    rank = rank || Math.floor(Math.random()*10000)
    let create_time = Date.now()
    
    if(id) {
        // 编辑  
        goodModel.updateOne({_id: id}, {img, name, desc, price, cate, hot, rank, create_time}).then(()=>{
            res.json({err:0, msg:'修改成功'})
        }).catch(err=>res.json({err:-1,msg:'修改失败'}))
    } else {
        // 新增
        goodModel.insertMany([{ img, name, desc, price, cate, hot, rank, create_time }]).then(()=>{
            res.json({err: 0, msg:'添加成功'})
        }).catch(err=>res.json({err:-1, msg:'添加失败'}))
    }
})

//获取所有商品
router.get('/cms/list',function(req,res){
    let { hot, page, size, cate } = req.query

    hot = hot || false;
    page = parseInt(page||1)
    size = parseInt(size||10)
    cate = cate || ''

    let params = {cate}
    if (!cate) delete params.cate

    goodModel.find(params).then(arr=>{
        let total = arr.length
        goodModel.find(params).limit(size).skip((page-1)*size).sort({create_time: -1}).then(list=>{
            res.json({err:0,msg:'success', data: { list, total }})
        }).catch(err=>{
            res.json({err:1,msg:'fail',err})
        })
    })
    
})

//获取商品详情
router.get('/cms/detail', function(req, res) {
    let { good_id } = req.query
    if(!good_id) return res.json({err:1,msg:'商品id就必填参数'})
    goodModel.find({_id: good_id}).then(arr=>{
        res.json({err:0, msg:'success', data: arr[0]})
    })
})

//删除商品
router.get('/cms/del',function(req,res){
    let { id } = req.query
    if(!id) return res.json({err:-1,msg:'fail',data:'商品id是必须参考'})
    goodModel.deleteOne({"_id":id}).then(arr=>{
        res.json({err:0,msg:'删除成功'})
    }).catch(err=>res.json({err:-1,msg:'删除失败'}))
})

// 基于品类筛选
router.get('/getCateGoodList', function(req, res, next) {
    let { cate, page, size } = req.query
  
    cate = cate || ''
    page = parseInt(page||1)
    size = parseInt(size||1000)
  
    let params = {cate}
    if (!cate) delete params.cate
  
    console.log(params)
  
    // limit(size).skip((page-1)*size).sort({rank: -1})
  
    goodModel.find({}).then(arr=>{
      console.log(arr)
      res.json({err:0,msg:'success',data:arr})
    }).catch(err=>{
      res.json({err:1,msg:'fail',err})
    })
  })
  
module.exports = router;