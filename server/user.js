const express = require('express')

const Router = express.Router()

const sequelize = require('./db')
const account = sequelize.model('account')
const poetrylist = sequelize.model('poetrylist')

const utility  = require('utility')

Router.get('/test', function (req, res) {
  return res.json({
    code: 1,
    arr: [{
      name: 123
    }]
  })
})

Router.post('/register', function(req, res) {
  // 用户注册
  const body = req.body.userinfo
  const {user_name, pwd} = req.body.userinfo
  const data = {
    user_name: user_name,
    pwd: pwdMd5(pwd),
    create_temp: new Date().getTime(),
    user_id: pwdMd5(Date.now())
  }
  account.create(data).then(doc => {
    const {user_name, user_id, user_info, avatar} = doc
    res.cookie('user_id', user_id)
    return res.json({
      code: 0,
      data: {
        user_name: user_name,
        user_id: user_id,
        user_info: user_info,
        avatar: avatar
      }
    })
  })
})

Router.post('/updataUserInfo', function(req,res) {
  // 完善用户信息
  const user_id = req.cookies.user_id
  const user_info = req.body.userinfo
  account.update(user_info, {'where': {'user_id': user_id}}).then((doc) => {
    return res.json({
      code: 0,
      data: {
        user_info: user_info
      }
    })
  })
})

Router.post('/getUserInfo', function(req,res) {
  // 完善用户信息
  const user_id = req.cookies.user_id
  account.findOne({'where': {'user_id': user_id}}).then((doc) => {
    // 过滤用户信息
    const {email, user_info, user_name, avatar} = doc
    const userinfo = {
      email: email,
      user_info: user_info,
      user_name: user_name,
      avatar: avatar
    }
    return res.json({
      code: 0,
      data: userinfo
    })
  })
})

Router.get('/getalluser', function(req,res) {
  // 用户列表
  account.findAll({}).then(doc => {
    return res.json({
      code: 0,
      data: doc
    })
  })
})

Router.post('login', function (req, res) {
  console.log(req.body)
})

Router.get('/cleardata', function(req,res) {
  // 清空全部数据
  poetrylist.destroy({'where':{'id': 13}}).then((doc) => {
    return res.json({
      code: 0,
      data: doc
    })
  })
})

Router.post('/linkPoetry', function(req, res) {
  // 点赞骚话
  const num = req.body.num
  const id = req.body.id
  poetrylist.update({recommend: num},{'where':{id: id}}).then(doc => {
    return res.json({
      code: 0,
      data: num
    })
  })
})

Router.post('/addPoetryItem', function(req, res) {
  // 发表一个骚话
  // pwdMd5
  const body = req.body.item
  const data = Object.assign({},{
    poetrylist_id: pwdMd5(Date.now())
  },body)
  poetrylist.create(data).then(doc => {
    return res.json({
      code: 0,
      data: doc
    })
  })
})

Router.get('/getPoetryList', function(req, res) {
  // 获取全部骚话
  poetrylist.findAll({}).then((doc) => {
    return res.json({
      code: 0,
      data: doc
    })
  })
})

// 我们自己对原始的MD5进行复杂度调整
function pwdMd5(pwd) {
  const salt = 'Ethan_is_man_56good#@!45$sss$453%^&9**~~~~``'
  return utility.md5(utility.md5(pwd + salt))
}


module.exports = Router