const config = require('config');
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
        host: config.get('MySQL.host'),
        user: config.get('MySQL.user'),
        password: config.get('MySQL.password'),
        database: config.get('MySQL.database'),
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
});   

const pool_r1 = mysql.createPool({
    host: config.get('MySQLR1.host'),
    user: config.get('MySQLR1.user'),
    password: config.get('MySQLR1.password'),
    database: config.get('MySQLR1.database'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});   

const pool_r2 = mysql.createPool({
    host: config.get('MySQLR2.host'),
    user: config.get('MySQLR2.user'),
    password: config.get('MySQLR2.password'),
    database: config.get('MySQLR2.database'),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});   

var start = 0

getComments = (messageId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await pool.getConnection()
            const [rows, fields] = await connection.query("SELECT id, PublishDate, Comments AS Text, (SELECT CONCAT(FirstName, ' ', LastName) FROM Users WHERE id = C.AuthorID) AS AuthorName FROM Comments AS C WHERE C.MessageID = ?", [messageId]);
            connection.release()
            resolve(rows);
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
getCommentsR1 = (messageId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await pool_r1.getConnection()
            const [rows, fields] = await connection.query("SELECT id, PublishDate, Comments AS Text, (SELECT CONCAT(FirstName, ' ', LastName) FROM Users WHERE id = C.AuthorID) AS AuthorName FROM Comments AS C WHERE C.MessageID = ?", [messageId]);
            connection.release()
            resolve(rows);
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
getCommentsR2 = (messageId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const connection = await pool_r2.getConnection()
            const [rows, fields] = await connection.query("SELECT id, PublishDate, Comments AS Text, (SELECT CONCAT(FirstName, ' ', LastName) FROM Users WHERE id = C.AuthorID) AS AuthorName FROM Comments AS C WHERE C.MessageID = ?", [messageId]);
            connection.release()
            resolve(rows);
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}

async function TestSingle() {
    var commands = []
    let replica = 0

    for(let i = 0; i < 10000; i++) {
        if (replica === 0) {
            commands.push(getComments(Math.floor(Math.random() * (25000000 - 1000)) + 1000))
            replica = 1
        } else {
            commands.push(getComments(Math.floor(Math.random() * (25000000 - 1000)) + 1000))
            replica = 0
        }
    }
    
    console.log(commands.length)
    await Promise.all(commands)
}
async function TestReplicas() {
    var commands = []
    let replica = 0

    for(let i = 0; i < 10000; i++) {
        if (replica === 0) {
            commands.push(getCommentsR1(Math.floor(Math.random() * (25000000 - 1000)) + 1000))
            replica = 1
        } else {
            commands.push(getCommentsR2(Math.floor(Math.random() * (25000000 - 1000)) + 1000))
            replica = 0
        }
    }
    
    console.log(commands.length)
    await Promise.all(commands)
}
async function TestTripple() {
    var commands = []
    let replica = 0

    for(let i = 0; i < 10000; i++) {
        if (replica === 0) {
            commands.push(getComments(Math.floor(Math.random() * (25000000 - 1000)) + 1000))
            replica = 1
        } else if (replica === 1) {
            commands.push(getCommentsR1(Math.floor(Math.random() * (25000000 - 1000)) + 1000))
            replica = 2
        } else {
            commands.push(getCommentsR2(Math.floor(Math.random() * (25000000 - 1000)) + 1000))
            replica = 0
        }
    }
    console.log(commands.length)
    start = 1
    await Promise.all(commands)
}
async function Test() {

    console.time('replicas')
    await TestReplicas()
    console.timeEnd('replicas')

    console.time('single')
    await TestSingle()
    console.timeEnd('single')

    // console.time('all')
    // await TestTripple()
    // console.timeEnd('all')    

    process.exit(0)
}

Test()
