const config = require('config');
const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
    host: config.get('MySQL.host'),
    user: config.get('MySQL.user'),
    password: config.get('MySQL.password'),
    database: config.get('MySQL.database')
});

exports.getMessages = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).query('SELECT id, PublishDate, Message FROM Messages WHERE AuthorID = ? ORDER BY PublishDate ASC', [userId]);
            console.log(rows);
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
            console.log(rows);
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
