const jwt = require('jsonwebtoken')
const store = require('../store/users')

const RSA_KEYS = require('./rsakeys.js')

exports.verify = (token) => {
    if (!!token) {
        const userId = jwt.verify(token, RSA_KEYS.RSA_PUBLIC_KEY).sub
        if (!!userId) return userId
    }
    return null
}
exports.login = async (name, password) => {
    try {
        const userId = await store.getUser(name, password)
        const token =  jwt.sign({}, RSA_KEYS.RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: 480000000,
            subject: '' + userId
        })
        return ({ token: token, userId: '' + userId })
    }
    catch(exception) {
        return null
    }
}
