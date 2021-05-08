const express = require('express')
const store = require('../../store/messages')

const router = express.Router()

router.get('/', (req, res) => {
    res.sendStatus(200)
})

router.post('/', (req, res) => {
    store.addMessage(req.userId, req.body.message)
    .then(() => res.sendStatus(200))
    .catch((error) => res.sendStatus(500))
})

module.exports = router
