const http = require('http');
const assert = require('assert');

const cronometro = require('../server/src/core/cronometro');
const { startServer } = require('../server/server');

function request({ method, port, path, body }) {
    return new Promise((resolve, reject) => {
        const payload = body ? JSON.stringify(body) : null;

        const req = http.request(
            {
                hostname: '127.0.0.1',
                port,
                path,
                method,
                headers: payload
                    ? {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(payload)
                    }
                    : undefined
            },
            (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    let parsed = null;
                    if (data) {
                        parsed = JSON.parse(data);
                    }
                    resolve({ statusCode: res.statusCode, body: parsed });
                });
            }
        );

        req.on('error', reject);

        if (payload) {
            req.write(payload);
        }
        req.end();
    });
}

(async () => {
    console.log('Test HTTP routes: START');

    cronometro.stop();

    const server = startServer(0);
    const port = server.address().port;

    try {
        const pauseStopped = await request({ method: 'POST', port, path: '/pause' });
        assert.strictEqual(pauseStopped.statusCode, 409, 'PAUSE en STOPPED debe devolver 409');
        assert.strictEqual(pauseStopped.body.status, 'conflict');
        assert.strictEqual(pauseStopped.body.state, 'stopped');

        const startOk = await request({ method: 'POST', port, path: '/start' });
        assert.strictEqual(startOk.statusCode, 200, 'START en STOPPED debe devolver 200');
        assert.strictEqual(startOk.body.status, 'ok');
        assert.strictEqual(startOk.body.state, 'running');

        const startConflict = await request({ method: 'POST', port, path: '/start' });
        assert.strictEqual(startConflict.statusCode, 409, 'START en RUNNING debe devolver 409');
        assert.strictEqual(startConflict.body.status, 'conflict');
        assert.strictEqual(startConflict.body.state, 'running');

        const pauseOk = await request({ method: 'POST', port, path: '/pause' });
        assert.strictEqual(pauseOk.statusCode, 200, 'PAUSE en RUNNING debe devolver 200');
        assert.strictEqual(pauseOk.body.status, 'ok');
        assert.strictEqual(pauseOk.body.state, 'paused');

        const stopOk = await request({ method: 'POST', port, path: '/stop' });
        assert.strictEqual(stopOk.statusCode, 200, 'STOP en PAUSED debe devolver 200');
        assert.strictEqual(stopOk.body.status, 'ok');
        assert.strictEqual(stopOk.body.state, 'stopped');

        const stopConflict = await request({ method: 'POST', port, path: '/stop' });
        assert.strictEqual(stopConflict.statusCode, 409, 'STOP en STOPPED debe devolver 409');
        assert.strictEqual(stopConflict.body.status, 'conflict');
        assert.strictEqual(stopConflict.body.state, 'stopped');

        const status = await request({ method: 'GET', port, path: '/status' });
        assert.strictEqual(status.statusCode, 200, 'GET /status debe devolver 200');
        assert.strictEqual(status.body.status, 'ok');
        assert.strictEqual(typeof status.body.serverTime, 'number');
        assert.strictEqual(status.body.state, 'stopped');
        assert.strictEqual(typeof status.body.elapsedMs, 'number');
        assert(status.body.tiempo && typeof status.body.tiempo.min === 'number');
        assert(status.body.cronometro && status.body.cronometro.state === status.body.state);

        console.log('Test HTTP routes: OK');
    } finally {
        await new Promise((resolve) => server.close(resolve));
        cronometro.stop();
    }
})().catch((err) => {
    console.error('Test HTTP routes: ERROR', err.message);
    process.exit(1);
});
