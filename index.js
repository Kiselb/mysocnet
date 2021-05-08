const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require('./routers/auth')
const config = require('config');
const messages = require('./store/messages');

const app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, '/')))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'api')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use((req, res, next) => {
    console.log(`URL: ${req.originalUrl} Method: ${req.method}`);
    next();
})

const APPLICATION_PORT = config.get('Frontend.PORT');

const routersAPILogin = require('./routers/API/login.js')
const routersAPIMessages = require('./routers/API/messages.js')
const routersAPIProfile = require('./routers/API/profile.js')

const routersLogin = require('./routers/login.js')
const routersLogout = require('./routers/logout.js')
const routersMain = require('./routers/main.js')
const routersProfile = require('./routers/profile.js')
const routersPublic = require('./routers/public.js')

app.use(['/API1.0/messages', '/API1.0/profile', '/main', '/profile'], (req, res, next) => {
    let userId = auth.verifyAll(req);
    if (!userId) return res.sendStatus(401);
    req.userId = userId;
    next();
})

app.use('/API1.0/login', routersAPILogin)
app.use('/API1.0/messages', routersAPIMessages)
app.use('/API1.0/profile', routersAPIProfile)

app.use('/login', routersLogin)
app.use('/logout', routersLogout)
app.use('/main', routersMain)
app.use('/profile', routersProfile)
app.use('/public', routersPublic)

app.get('/', (req, res, next) => {
    const userId = auth.verifyAll(req);
    const aggregate = {};

    if (!userId) return res.render('public/index', {});
    messages.getSubscriptions(userId)
    .then(data => {
        aggregate.subscriptions = data;
        return messages.getMessages(userId);
    })
    .then(data => {
        aggregate.messages = data;
        return res.render('../views/private/main', aggregate);
    })
    .catch(error => {
        console.log(error);
        return res.sendStatus(500);
    });
})

app.listen(APPLICATION_PORT, () => console.log(`Running on Port ${APPLICATION_PORT}`));
