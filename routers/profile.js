const express = require('express')
const router = express.Router()
const store = require('../store/users')

router.get('/', (req, res) => {
    console.log("Render Profile")
    console.log(req.userId)
    store.getProfile(req.userId)
    .then(data => { console.log(data); return res.render('../views/private/profile', data); })
    .catch(error => res.sendStatus(500))    
})

module.exports = router
