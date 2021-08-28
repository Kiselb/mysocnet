const express = require('express');
const cluster = require('cluster')
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const auth = require('./routers/auth')
const config = require('config');
const messages = require('./store/messages');
const users = require('./store/users');

const APPLICATION_PORT = config.get('Frontend.PORT');

// if (cluster.isMaster) {
//     let cpus = os.cpus().length;
  
//     for (let i = 0; i < cpus; i++) cluster.fork();
  
//     cluster.on('exit', (worker, code) => {
//         console.log(
//             `Worker ${worker.id} finished. Exit code: ${code}`
//         );
  
//         app.listen(APPLICATION_PORT, () =>
//             console.log(`Worker ${cluster.worker.id} launched`)
//         );
//     });
//     return;
// }

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
    let cluster_worker_id = 0
    if (cluster.isWorker) {
        cluster_worker_id = cluster.worker.id
    }
    console.log(`URL: ${req.originalUrl} Method: ${req.method} Worker: ${cluster_worker_id}`);
    next();
})

const routersAPILogin = require('./routers/API/login.js')
const routersAPIMessages = require('./routers/API/messages.js')
const routersAPIProfile = require('./routers/API/profile.js')
const routersAPIRegister = require('./routers/API/register.js')
const routersAPIUsers = require('./routers/API/users.js')

const routersLogin = require('./routers/login.js')
const routersLogout = require('./routers/logout.js')
const routersMain = require('./routers/main.js')
const routersProfile = require('./routers/profile.js')
const routersPublic = require('./routers/public.js')

//app.use(['/API1.0/users', '/API1.0/messages', '/API1.0/profile', '/main', '/profile'], (req, res, next) => {
//app.use(['/API1.0/messages', '/API1.0/profile', '/main', '/profile'], (req, res, next) => {
app.use(['/API1.0/profile', '/main', '/profile'], (req, res, next) => {
        let userId = auth.verifyAll(req);
    if (!userId) return res.sendStatus(401);
    req.userId = userId;
    next();
})

app.use('/API1.0/login', routersAPILogin)
app.use('/API1.0/messages', routersAPIMessages)
app.use('/API1.0/profile', routersAPIProfile)
app.use('/API1.0/register', routersAPIRegister)
app.use('/API1.0/users', routersAPIUsers)

app.use('/login', routersLogin)
app.use('/logout', routersLogout)
app.use('/main', routersMain)
app.use('/profile', routersProfile)
app.use('/public', routersPublic)

function mainContent(req, res) {
    const userId = auth.verifyAll(req);
    const paramId = req.params.id;
    const aggregate = {};

    if (!userId) return res.render('public/index', {});
    
    messages.getSubscriptions(userId)
    .then(data => {
        aggregate.subscriptions = data;
        if (!!paramId) {
            return messages.getMessages(paramId);    
        }
        return messages.getMessages(userId);
    })
    .then(data => {
        aggregate.messages = data;
        if (!!req.query.commentsMessageId) {
            aggregate.commentsMessageId = req.query.commentsMessageId;
            console.log(`Comments for Message ID=${aggregate.commentsMessageId}`);
            return messages.getComments((+aggregate.commentsMessageId));
        }
        return [];
    })
    .then(data => {      
        aggregate.comments = data;
        if (req.query.criteria) {
            return users.getList(req.query.criteria);
        }
        return [];
    })
    .then(data => {
        console.log("Users List");
        console.log(data);
        aggregate.usersList = data;
        return res.render('../views/private/main', aggregate);
    })
    .catch(error => {
        console.log(error);
        return res.sendStatus(500);
    });
}

app.get('/', (req, res, next) => {
    console.log('/');
    mainContent(req, res);
})
app.get('/:id', (req, res, next) => {
    console.log('/:id');
    mainContent(req, res)
})

app.listen(APPLICATION_PORT, () => console.log(`Running on Port ${APPLICATION_PORT}`));
