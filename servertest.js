const express = require('express');
const path = require('path');

const APPLICATION_PORT = 3000;

const app = express();

app.use(express.static(path.join(__dirname, '/')));
app.use(express.static(path.join(__dirname, 'api')));

app.get('/', (req, res, next) => {
    res.status(200).send("Connection is OK");
});

app.listen(APPLICATION_PORT, () => console.log(`Running on Port ${APPLICATION_PORT}`));
