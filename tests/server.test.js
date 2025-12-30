// tests/server.test.js

const http = require('http');
const assert = require('assert');

const SERVER_HOST = 'localhost';
const SERVER_PORT = 3000;

http.get(`http://${SERVER_HOST}:${SERVER_PORT}/status`, (res) => {
    let data = '';

    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        assert.strictEqual(res.statusCode, 200, 'El servidor debe responder correctamente');
        console.log('Test server: OK');
    });
}).on('error', (err) => {
    console.error('Test server: ERROR', err.message);
});