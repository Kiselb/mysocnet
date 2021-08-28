const express = require('express')
const store = require('../../store/messages')

const router = express.Router()
var replica_switch = true;

router.get('/', (req, res) => {
    res.sendStatus(200)
})

router.get('/:messageid/comments', (req, res) => {
    // console.log('Master ...')
    // store.getComments(+req.params.messageid)
    // .then((data) => res.status(200).send(data))
    // .catch((error) => res.sendStatus(500))
    res.redirect(`/API1.0/messages/${+req.params.messageid}/commentsreplicamaster`)})

router.get('/:messageid/commentsmaster', (req, res) => {
    console.log('Master ...')
    store.getComments(+req.params.messageid)
    .then((data) => res.status(200).send(data))
    .catch((error) => res.sendStatus(500))
})

router.get('/:messageid/commentsreplica1', (req, res) => {
    console.log('Test Replica R1 ...')
    store.getCommentsR1(+req.params.messageid)
    .then((data) => { console.log('Replica R1 completed ...'); return res.status(200).send(data); })
    .catch((error) => res.sendStatus(500))
})

router.get('/:messageid/commentsreplica2', (req, res) => {
    console.log('Test Replica R2 ...')
    store.getCommentsR2(+req.params.messageid)
    .then((data) => { console.log('Replica R2 completed ...'); return res.status(200).send(data); })
    .catch((error) => res.sendStatus(500))
})

router.get('/:messageid/commentsreplicated', (req, res) => {
    if (replica_switch) {
        // console.log('Replica 1 ...')
        // store.getCommentsR1(+req.params.messageid)
        // .then((data) => { return res.status(200).send(data); })
        // .catch((error) => res.sendStatus(500))
        res.redirect(`/API1.0/messages/${+req.params.messageid}/commentsreplica1`)
    } else {
        // console.log('Replica 2 ...')
        // store.getCommentsR2(+req.params.messageid)
        // .then((data) => { return res.status(200).send(data); })
        // .catch((error) => res.sendStatus(500))    
        res.redirect(`/API1.0/messages/${+req.params.messageid}/commentsreplica2`)
    }
    replica_switch = !replica_switch
})

router.post('/', (req, res) => {
    console.log(`User: ${req.userId} Message: ${req.body.message}`)
    store.addMessage(req.userId, req.body.message)
    .then(() => res.sendStatus(200))
    .catch((error) => res.sendStatus(500))
})

module.exports = router
