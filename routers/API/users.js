const express = require('express')
const router = express.Router()
const store = require('../../store/users')

router.get('/', (req, res) => {
    console.log("Find Users ...")
    console.log(req.query.FirstName)
    console.log(req.query.LastName)
    store.getListByNames(req.query.FirstName, req.query.LastName)
    .then(data => res.sendStatus(200))
    .catch(error => {
        console.log(error)
        res.sendStatus(500)
    });   
})

module.exports = router
