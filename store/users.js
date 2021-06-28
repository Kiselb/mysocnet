const config = require('config');
const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: config.get('MySQL.host'),
    user: config.get('MySQL.user'),
    password: config.get('MySQL.password'),
    database: config.get('MySQL.database')
});

exports.getUser = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).query('SELECT id FROM Users WHERE email = ? AND CryptoPassword = SHA2(?, 0)', [email, password]);
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
exports.register = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).execute('INSERT INTO Users (FirstName, LastName, email, CryptoPassword, BirthDate, Interests, Gender, City) VALUES (?, ?, ?, SHA2(?, 0), ?, ?, ?, ?)', [params.FirstName, params.LastName, params.EMail, params.Password, params.BirthDate, params.Interests, params.Gender, params.City]);
            resolve();
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
exports.getList = (criteria) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pattern = '%' + criteria + '%';
            const [rows, fields] = await (await connection).query('SELECT id, FirstName, LastName, email, City FROM Users AS U WHERE email LIKE ? ORDER BY FirstName, LastName LIMIT 50', pattern);
            console.log(rows);
            resolve(rows);
        }
        catch(exception) {
            reject(exception);
        }
    });
}
exports.getListByNames = (firstNamePattern, lastNamePattern) => {
    return new Promise(async (resolve, reject) => {
        try {
            const pattern1 = '%' + firstNamePattern + '%';
            const pattern2 = '%' + lastNamePattern + '%';
            //const [rows, fields] = await (await connection).query('SELECT id, FirstName, LastName, email, City FROM Users AS U WHERE (LastName LIKE ?) AND (FirstName LIKE ?) ORDER BY id', [pattern2, pattern1]);
            const [rows, fields] = await (await connection).query('SELECT id, FirstName, LastName, email, City FROM Users AS U WHERE (LastName LIKE ?) AND (FirstName LIKE ?) ORDER BY id', [lastNamePattern, firstNamePattern]);
            console.log(rows);
            resolve(rows);
        }
        catch(exception) {
            reject(exception);
        }
    });
}
exports.subscribe = (params) => {
    return new Promise(async (resolve, reject) => {
        try {
            const [rows, fields] = await (await connection).execute('INSERT INTO Subscriptions (UserID, AuthorID) VALUES (?, ?)', [params.userId, params.authorId]);
            resolve();
        }
        catch(exception) {
            console.log(exception);
            reject(exception);
        }
    });
}
