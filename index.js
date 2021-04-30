const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const config = require('config');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'api')));
app.use(cookieParser());
app.use(cors());
app.use((req, res, next) => {
    console.log(req.originalUrl);
    next();
})

const APPLICATION_PORT = config.get('Frontend.PORT');

const routersLogin = require('./routers/login.js')
const routersLogout = require('./routers/logout.js')

app.get('/', (req, res, next) => {
    res.render('public/index', {})
})

app.use('/login', routersLogin)
app.use('/logout', routersLogout)

app.listen(APPLICATION_PORT, () => console.log(`Running on Port ${APPLICATION_PORT}`));
