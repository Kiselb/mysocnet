const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('../views/private/main')
})

module.exports = router
