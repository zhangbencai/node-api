var express = require('express');
var router = express.Router();
var cateModel = require('../model/cateModel')

//新增品类
router.post('/cms/add',function(req,res,next){
    let {cate,cate_zh} = req.body
    let ele = {
        cate,
        cate_zh,
        create_time:Date.now()
    }
    cateModel.insertMany([ele]).then(()=>{
        res.json({err:0,msg:'success'})
    })
})

//获取所有品类
router.get('/cms/all',function(req,res){
    let ele = {
        _id:_id ? _id : ''
    }
    cateModel.find({}).then(arr=>{
        res.json({err:0, msg:'success',data: {list:arr}})
    })
})

//删除品类
router.get('/cms/one',function(req,res){
    let {_id} = req.query
    cateModel.deleteOne({"_id":_id}).then(arr=>{
        res.json({err:0,msg:'success'})
    })
})

// 获取全部品类
router.get('/getAllCates', function(req, res, next) {
    // 1 由小到大
    cateModel.find({}).sort({rank: 1}).then(arr=>{
      res.json({err:0,msg:'success',data:arr})
    }).catch(err=>{
      res.json({err:1,msg:'fail',err})
    })
  })
  
module.exports = router;