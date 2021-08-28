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

async function writeComments (messageId, count) {
    try {
        const connection = await pool.getConnection()
        const [rows, fields] = await connection.query("INSERT INTO Comments (MessageID, AuthorID, Comments) VALUES (?, 124123, " + "'GTID_Transactions_Payload_" + count + "')", [messageId]);
        connection.release()
    }
    catch(exception) {
        console.log(exception);
    }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

async function main() {
    for(let i = 0; i < 100000; i++) {
        await delay(10)
        await writeComments(24658384, i)
    }
    process.exit(0)
}

main()
