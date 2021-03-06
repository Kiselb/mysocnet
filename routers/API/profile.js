const express = require('express')
const router = express.Router()
const store = require('../../store/users')

router.get('/', (req, res) => {
    res.sendStatus(200)
})

router.post('/subscribe', (req, res) => {
    console.log("Subscribe")
    console.log(req.body)
    store.subscribe({ userId: req.userId, ...req.body })
    .then(data => res.sendStatus(200))
    .catch(error => {
        console.log(error)
        res.sendStatus(500)
    });   
})

module.exports = router
