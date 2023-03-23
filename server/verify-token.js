const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization
  if (!token) {
    res.status(401).send({ success: false, massage: 'No token provided' })
  } else {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res
          .status(500)
          .send({ success: false, message: 'Error verifying token' })
      } else {
        req.user = decoded
        next()
      }
    })
  }
}

module.exports = { verifyToken }
