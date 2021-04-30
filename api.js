const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const auth = require('./routers/auth')
const login = require('./api/login')

const app = express()

app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, 'api')));

app.use(cookieParser())
app.use(cors())

app.use(['/courses', '/streams'], (req, res, next) => {
    console.log("Header", req.header('Authorization'))
    const userId = auth.verify(req.header('Authorization'))
    if (!!userId) {
        req.mycoursesUserId = userId
        next()
    } else {
        res.sendStatus(401)
    }
})

app.use('/login', login)

const API_PORT = 5100;   

app.listen(API_PORT, () => console.log(`API Running on Port ${API_PORT}`))
