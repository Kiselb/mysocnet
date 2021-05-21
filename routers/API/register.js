const express = require('express')
const router = express.Router()
const store = require('../../store/users')

router.post('/', (req, res) => {
    console.log("Register User")
    console.log(req.body)
    store.register(req.body)
    .then(data => res.sendStatus(200))
    .catch(error => {
        console.log(error)
        res.sendStatus(500)
    });   
})

module.exports = router
