const express = require('express')
const router = express.Router()

router.get('/registration', (req, res) => {
    console.log("Render Agreements ...")
    res.render('public/agreements', {})
})

router.get('/agreements', (req, res) => {
    console.log("Render Agreements ...")
    res.render('public/agreements', {})
})

router.get('/about', (req, res) => {
    console.log("Render About ...")
    res.render('public/about', {})
})

module.exports = router
