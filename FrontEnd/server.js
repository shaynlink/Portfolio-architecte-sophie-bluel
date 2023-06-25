const http = require('http');
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use('/assets', express.static('assets'));

app.get('/', (req, res) => {
    const stream = fs.createReadStream(
        path.resolve(path.join(__dirname, 'index.html'))
    )
    
    res.setHeader('Content-Type', 'text/html;charset=utf8');
    res.status(200);

    stream.pipe(res);
});

app.get('/login', (req, res) => {
    const stream = fs.createReadStream(
        path.resolve(path.join(__dirname, 'login.html'))
    )
    
    res.setHeader('Content-Type', 'text/html;charset=utf8');
    res.status(200);

    stream.pipe(res);
});

const server = http.createServer(app);
server.listen(3000, () => console.log('Server listening on http://localhost:3000'));
