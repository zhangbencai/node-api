const jwt = require('jsonwebtoken')

//加密token
function createToken(data){
    let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60 *24),
        data: data
    }, 'my');

    return token
}

// 解析token
function verifyToken(req, res) {
    let token = req.headers.authorization
    if (!token) {
      return res.json({err:-1,msg:'token invalid'})
    }
    return new Promise(function(resolve, reject) {
      try {
        let decoded = jwt.verify(token, 'my')
        resolve(decoded.data)
      } catch(err) {
        // reject({err:-1,msg:'token invalid'})
        res.json({err:-1,msg:'token invalid'})
      }
    })
}

module.exports = {
    createToken,
    verifyToken
}