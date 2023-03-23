require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const { verifyToken } = require('./verify-token')

app.use(cors())
app.use(bodyParser.json())
const port = 3000

const sqlite = require('sqlite3').verbose()
const db = new sqlite.Database('./users.db', sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err)
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      res
        .status(500)
        .send({ success: false, message: 'Error hashing password' })
    } else {
      const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
      db.run(sql, [name, email, hash], (err) => {
        if (err) {
          res.status(500).send({
            success: false,
            message: 'Error inserting user into database',
          })
        } else {
          res
            .status(200)
            .send({ success: false, message: 'User registered successfully' })
        }
      })
    }
  })
})

app.post('/login', (req, res) => {
  const { email, password } = req.body
  console.log({ email, password })
  const sql = 'SELECT * FROM users WHERE email = ?'
  db.get(sql, [email], (err, user) => {
    if (err) {
      res.status(500).send({
        success: false,
        message: 'Error retrieving user from database',
      })
    } else if (!user) {
      res.status(401).send({ success: false, message: 'User not found' })
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res
            .status(500)
            .send({ success: false, message: 'Error comparing passwords' })
        } else if (!result) {
          res
            .status(401)
            .send({ success: false, message: 'Incorrect password' })
        } else {
          const token = jwt.sign(
            { name: user.name, email: user.email, id: user.id },
            process.env.ACCESS_TOKEN_SECRET
          )
          res
            .status(200)
            .send({ success: true, token, message: 'User login successfully' }) // token
        }
      })
    }
  })
})

app.get('/protected', verifyToken, (req, res) => {
  res.status(200).send({
    success: true,
    user: req.user,
    message: `Welcome, ${req.user.name}`,
  })
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
