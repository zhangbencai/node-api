var express = require('express');
var router = express.Router();
var jwt = require('../utils/jwt')
var goodModel = require('../model/goodModel')
var cateModel = require('../model/cateModel')
var userModel = require('../model/userModel');

var cartModel = require('../model/webapp/cartModel.js')  // carts
var orderModel = require('../model/webapp/orderModel') // orders
var adModel = require('../model/adModel.js')  // ads


/*
* 轮播图管理 =============================================================
*/
//添加轮播图
router.post('/ads/create', function(req, res) {
    let { text, img } = req.body
    let ele = {
        text,
        img,
        create_time: Date.now()
    }
    adModel.insertMany([ele]).then(()=>{
        res.json({err:0,msg:'success'})
    })
})

//查看轮播图
router.get('/ads/all', function(req,res) {
    adModel.find({}).then(arr=>{
        res.json({err:0,msg:'success', data: {list:arr}})
    })
})


/*
* 商品管理 =============================================================
*/


/* 获取商品列表 */
router.get('/getHotGoodList', function(req, res, next) {
  let { hot, page, size, cate } = req.query

  hot = hot || false;
  page = parseInt(page||1)
  size = parseInt(size||10)
  cate = cate || ''

  let params = {cate}
  if (!cate) delete params.cate

  goodModel.find().then(arr=>{
    let total = arr.length
    goodModel.find(params).limit(size).skip((page-1)*size).sort({create_time: -1}).then(list=>{
      res.json({err:0,msg:'success', data: { list, total }})
    }).catch(err=>{
      res.json({err:1,msg:'fail',err})
    }) 
  })

  
})

// 获取商品详情
router.get('/getGoodDetail', function(req, res, next) {
  let { good_id } = req.query
  if(!good_id) return res.json({err:1,msg:'商品id就必填参数'})
  goodModel.find({_id:good_id}).then(arr=>{
    res.json({err:0, msg:'success', data: arr[0]})
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

// 基于品类筛选
router.get('/getCateGoodList', function(req, res, next) {
  let { cate, page, size } = req.query

  cate = cate || ''
  page = parseInt(page||1)
  size = parseInt(size||1000)

  let params = {cate}
  if (!cate) delete params.cate

  console.log('aaaaaaaaaa',params)

  // limit(size).skip((page-1)*size).sort({rank: -1})

  goodModel.find(params).then(arr=>{
    console.log(arr)
    res.json({err:0,msg:'success',data:arr})
  }).catch(err=>{
    res.json({err:1,msg:'fail',err})
  })
})


/*
* 购物管理 =============================================================
*/

// 加入购物车(token)
router.post('/addToCart', function(req, res, next) {
  let { num, good_id } = req.body

  // 识别用户，使用前端传递过来的token进行解析
  // 入库，


  num = num || 1
  if (!good_id) return res.json({err: -1, msg: 'good_id商品id是必填参数'})

  // 解析用户身份
  jwt.verifyToken(req, res).then(user=>{
    // 把token反解析成功后，就得到了用户名和密码
    userModel.find(user).then(arr=>{
      let item = {
        user_id: arr[0]._id,  // 用户id
        good_id,   // 商品id
        num,
        create_time: Date.now(),
        status: 1
      }
      // 购物车入库
      // 入参还要判断，如果在 jdcarts 中已经存在了当前 good_id，直接num++即可，无须重复添加
      cartModel.find({good_id, user_id: item.user_id}).then(arr1=>{
        if (arr1.length == 0) {
          cartModel.insertMany([item]).then(()=>{
            res.json({err:0,msg:'加入购物车成功'})
          })
        } else {
          cartModel.updateOne({good_id, user_id: item.user_id}, {num: arr1[0].num+1}).then(()=>{
            res.json({err:0,msg:'加入购物车成功'})
          })
          
        }
      })
    })
  })
})

// 获取购物车列表
router.get('/getCartList', function(req, res, next) {
  let { page, size } = req.query

  page = parseInt(page||1)
  size = parseInt(size||1000)

  jwt.verifyToken(req, res).then(user=>{
    userModel.find(user).then((userArr)=>{
      // -1 按时间从大到小
      cartModel.find({status:1, user_id: userArr[0]._id}).limit(size).skip((page-1)*size).sort({create_time: -1}).then(arr1=>{
        if(arr1.length==0) return res.json({err:0, msg:'success', data: []})
        let list = []
        // 遍历获取商品信息，一起传递给购物车列表
        arr1.map((ele,idx)=>{
          goodModel.find({_id: ele.good_id}).then(arr2=>{
            list.push({
              _id: ele._id,
              good_id: ele.good_id,
              create_time: ele.create_time,
              user_id: ele.user_id,
              num: ele.num,
              status: ele.status,
              good: arr2[0]
            })
            if (list.length == arr1.length) {
              res.json({err:0,msg:'success',data:list})
            }
          })
        })
      })
    })
  })
})

// 改变购物车商品数量
router.post('/updateCartNum', function(req, res, next) {
  let { num, id } = req.body

  if (!num) return res.json({err:-1, msg:'num是必填参数'})
  if (num < 1) return res.json({err:-1, msg:'num不能小于1'})
  if (!id) return res.json({err:-1, msg:'id是必填参数'})

  jwt.verifyToken(req, res).then(user=>{
    cartModel.updateOne({_id: id}, {num}).then(()=>{
      res.json({err:0,msg:'成功'})
    })
  })
})

// 删除购物车商品
router.get('/deleteToCart', function(req, res, next) {
  let { id } = req.query

  if (!id) return res.json({err: -1, msg:'id是必填参数'})

  jwt.verifyToken(req, res).then(user=>{
    cartModel.deleteMany({_id: id}).then(()=>{
      res.json({err:0,msg:'删除成功'})
    })
  })
})

// 提交购物车
router.post('/submitToCart', function(req, res, next) {
  let { goods } = req.body

  // goods是用 ; 连接起来的 _id的字符串，不能用数组进行传递
  if (!goods) return res.json({err: -1, msg: 'goods是必填参数'})

  let goodIdArr = goods.split(';')
  goodIdArr.map((ele,idx)=>{
    if (!ele) goodIdArr.splice(idx,1)
  })

  jwt.verifyToken(req, res).then(user=>{
    let count = 0
    goodIdArr.map(ele=>{
      cartModel.deleteMany({_id: ele}).then(()=>{
        count++
        if (count == goodIdArr.length) {
          res.json({err:0, msg:'下单成功'})
          // 向'订单'集合中插入一条订单记录
        }
      })
    })
  })
})

module.exports = router;