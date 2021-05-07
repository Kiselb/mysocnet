const express = require('express')
const auth = require('../auth')

const router = express.Router()

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        console.log(`Autenticating User: ${req.body.name} ${req.body.password}`);
        if (!req.body.name || !req.body.password) {
            res.sendStatus(401)
        } else {
            const token = await auth.login(req.body.name, req.body.password)
            if (!!token) {
                res.setHeader('Authorization', token.token)
                res.cookie('mysocnettoken', token.token, { httpOnly: true }) //, secure: true})
                res.status(200).send({ userId: token.userId })
            } else {
                res.sendStatus(401)
            }
        }
    } catch(err) {
        res.sendStatus(401)
    }
})

module.exports = router
