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

    //await conn.eval("box.space.mysocionet:drop()")
    //console.log('Space Dropped ...')

    await conn.eval("box.schema.space.create('mysocionet')")
    console.log('Space Created ...')

    await conn.eval("box.space.mysocionet:create_index('mysocionet_primary_idx')")
    
    const chunkSize = 10000;
    const blocksNum = Math.ceil(totalRows / chunkSize);

    for(let i = 0; i < blocksNum; i++) {
        const offset = i * chunkSize;
        const [rows, fields] = await (await connection).query('SELECT id, email, CryptoPassword, FirstName, LastName FROM Users LIMIT ' + offset + ',' + chunkSize, []);
        for(let j = 0; j < rows.length; j++) {
            await conn.insert("mysocionet", [rows[j].id, rows[j].email, rows[j].CryptoPassword, rows[j].FirstName, rows[j].LastName])
        }
        console.log(`Block: ${i}`);
    }
    
    await conn.eval("box.space.mysocionet:create_index('mysocionet_secondary_idx', {unique = false, parts = {{field = 4, type = 'string'}, {field = 5, type = 'string'}}})")
    
    let response = await conn.eval('return box.space');
    console.log(response);
    response = await conn.eval('return box.space.mysocionet:len()');
    console.log(response);

    const users = await conn.call('getUsers', 'Donaugh', 'Borres')
    console.log(users)

})
.catch(error => console.log(error))

// main()
// .then(async () => {
//     const conn = new TarantoolConnection('bxu.group.legion.ru:3301'); //'10.106.101.117'
    
//     const currentUser = await conn.eval('return box.session.user()')
//     console.log(currentUser);

//     const spaces = await conn.eval('return box.space');
//     console.log(spaces);

//     const users = await conn.call('getUsers', 'Donaugh', 'Borres')
//     console.log(users)

// })
// .catch(error => console.log(error))
