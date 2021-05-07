const config = require('config');
const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
    host: config.get('MySQL.host'),
    user: config.get('MySQL.user'),
    password: config.get('MySQL.password'),
    database: config.get('MySQL.database')
});

exports.getUser = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).query('SELECT id FROM Users WHERE email = ? AND Password = ?', [email, password]);
            if (!rows[0]) {
                reject("User does not exists");
            } else {
                resolve(rows[0].id);
            }
        }
        catch(exception) {
            reject(exception);
        }
    });
}
exports.getProfile = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).query('SELECT FirstName, LastName, email, BirthDate, Interests, Gender, City, CountryID, (SELECT CountryName FROM Countries WHERE CountryID = U.CountryID) AS CountryName FROM Users AS U WHERE id = ?', [userId]);
            if (!rows[0]) {
                reject("User does not exists");
            } else {
                resolve(rows[0]);
            }
        }
        catch(exception) {
            reject(exception);
        }
    });
}
