const config = require('config');
const mysql = require('mysql2/promise');
const TarantoolConnection = require('tarantool-driver');

const connection = mysql.createPool({
    host: config.get('MySQL.host'),
    user: config.get('MySQL.user'),
    password: config.get('MySQL.password'),
    database: config.get('MySQL.database')
});

main = () => {
    return Promise.resolve();
}

main()
.then(async () => {
    const [rows, fields] = await (await connection).query('SELECT COUNT(*) AS UC FROM Users', []);
    const totalRows = rows[0].UC;

    console.log(`Users Count: ${totalRows}`)
    const conn = new TarantoolConnection('bxu.group.legion.ru:3301'); //'10.106.101.117'
    
    const currentUser = await conn.eval('return box.session.user()')
    console.log(currentUser);

    await conn.eval("box.schema.space.create('msnusers')")
    await conn.eval("box.space.msnusers:create_index('msnusers_primary_idx')")
    
    const chunkSize = 10000;
    const blocksNum = Math.ceil(totalRows / chunkSize);

    for(let i = 0; i < blocksNum; i++) {
        const offset = i * chunkSize;
        const [rows, fields] = await (await connection).query('SELECT id, email, CryptoPassword FROM Users LIMIT ' + offset + ',' + chunkSize, []);
        for(let j = 0; j < rows.length; j++) {
            await conn.insert("msnusers", [rows[j].id, rows[j].email, rows[j].CryptoPassword])
        }
        console.log(`Block: ${i}`);
    }
    let response = await conn.eval('return box.space');
    console.log(response);
    response = await conn.eval('return box.space.msnusers:len()');
    console.log(response);

})
.catch(error => console.log(error))
