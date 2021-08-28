const config = require('config');
const mysql = require('mysql2/promise');

connection = mysql.createPool({
        host: config.get('MySQL.host'),
        user: config.get('MySQL.user'),
        password: config.get('MySQL.password'),
        database: config.get('MySQL.database')
});   

connection_r1 = mysql.createPool({
    host: config.get('MySQLR1.host'),
    user: config.get('MySQLR1.user'),
    password: config.get('MySQLR1.password'),
    database: config.get('MySQLR1.database')
});   

connection_r2 = mysql.createPool({
    host: config.get('MySQLR2.host'),
    user: config.get('MySQLR2.user'),
    password: config.get('MySQLR2.password'),
    database: config.get('MySQLR2.database')
});   

exports.getMessages = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).query('SELECT id, PublishDate, Message FROM Messages WHERE AuthorID = ? ORDER BY PublishDate ASC', [userId]);
            resolve(rows);
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
exports.getSubscriptions = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).query('SELECT U.id, U.FirstName, U.LastName, U.City, (SELECT CountryName FROM Countries WHERE CountryID = U.CountryID) AS CountryName FROM Subscriptions AS S INNER JOIN Users AS U ON U.id = S.AuthorID WHERE S.UserID = ?', [userId]);
            resolve(rows);
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
exports.addMessage = (userId, message) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).execute('INSERT INTO Messages (AuthorID, Message) VALUES (?, ?)', [userId, message]);
            resolve();
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
exports.getComments = (messageId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).query("SELECT id, PublishDate, Comments AS Text, (SELECT CONCAT(FirstName, ' ', LastName) FROM Users WHERE id = C.AuthorID) AS AuthorName FROM Comments AS C WHERE C.MessageID = ?", [messageId]);
            resolve(rows);
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
exports.getCommentsR1 = (messageId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection_r1).query("SELECT id, PublishDate, Comments AS Text, (SELECT CONCAT(FirstName, ' ', LastName) FROM Users WHERE id = C.AuthorID) AS AuthorName FROM Comments AS C WHERE C.MessageID = ?", [messageId]);
            resolve(rows);
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
exports.getCommentsR2 = (messageId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection_r2).query("SELECT id, PublishDate, Comments AS Text, (SELECT CONCAT(FirstName, ' ', LastName) FROM Users WHERE id = C.AuthorID) AS AuthorName FROM Comments AS C WHERE C.MessageID = ?", [messageId]);
            resolve(rows);
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
