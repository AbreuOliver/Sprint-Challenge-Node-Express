const express = require('express');
const server = express();
server.use('/', (req, res) => {
    res.status(200).send('Hello, from my Express project so far!')
});

server.listen(9000, () => {
    console.log('All is good on port 9000!');
});


