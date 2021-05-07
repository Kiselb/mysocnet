const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const auth = require('./routers/auth')
const login = require('./api/login')

const app = express()

app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, 'api')));

app.use(cookieParser())
app.use(cors())

app.use(['/courses', '/streams'], (req, res, next) => {
    console.log("Header", req.header('Authorization'))
    const userId = auth.verify(req.header('Authorization'))
    if (!!userId) {
        req.mycoursesUserId = userId
        next()
    } else {
        res.sendStatus(401)
    }
})

app.use('/login', login)

// Test MySQL Connection

const config = require('config');
const mysql = require('mysql2/promise');
(async function() {
    try {
        const connection = await mysql.createConnection({
            host: config.get('MySQL.host'),
            user: config.get('MySQL.user'),
            password: config.get('MySQL.password'),
            database: config.get('MySQL.database')
        });
        
        const [rows, fields] = await connection.query('SELECT ID FROM TEST WHERE ID = ?', [1]);
        console.log(rows);
        connection.end();    
    } catch(exception) {
        console.log(exception);
    }
})();

const API_PORT = 5100;   

app.listen(API_PORT, () => console.log(`API Running on Port ${API_PORT}`))
