const express = require('express')
const router = express.Router()
const store = require('../../store/users')
const TarantoolConnection = require('tarantool-driver');

router.get('/', async (req, res) => {
    console.log("Find Users ...")
    console.log(req.query.FirstName)
    console.log(req.query.LastName)
    if (req.query.tarantool) {
        console.log('Tarantool Mode ...')
        const conn = new TarantoolConnection('bxu.group.legion.ru:3301'); //'10.106.101.117'

        const users = await conn.call('getUsers', req.query.FirstName, req.query.LastName)
        console.log(users)
        return res.status(200).send(users)    
    } else {
        store.getListByNames(req.query.FirstName, req.query.LastName)
        .then(data => res.sendStatus(200))
        .catch(error => {
            console.log(error)
            res.sendStatus(500)
        });   
    }
})

module.exports = router
