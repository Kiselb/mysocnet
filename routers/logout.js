const express = require('express')
const auth = require('./auth')

const router = express.Router()

router.post('/', (req, res) => {
    res.clearCookie('mysocnettoken', { httpOnly: true}) //, secure: true})
    res.sendStatus(200)
})

module.exports = router
