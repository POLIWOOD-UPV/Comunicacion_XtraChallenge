// ws_server.js
const WebSocket = require('ws');
const cronometro = require('./src/core/cronometro');

const WS_TICK_MS = Number(process.env.WS_TICK_MS || 100);

function safeSend(ws, payload) {
    if (ws.readyState !== WebSocket.OPEN) {
        return;
    }

    ws.send(JSON.stringify(payload));
}

function initWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    console.log('Servidor WebSocket inicializado');

    wss.on('connection', (ws) => {
        console.log('Cliente WebSocket conectado');

        // Enviar estado inicial
        safeSend(ws, {
            type: 'status',
            message: 'Conectado al servidor WebSocket'
        });

        // Intervalo para enviar el tiempo del cronómetro
        const intervalId = setInterval(() => {
            const tiempo = cronometro.getTiempo();
            safeSend(ws, {
                type: 'time',
                payload: {
                    tiempo,
                    state: cronometro.getState(),
                    elapsedMs: cronometro.getElapsedMs(),
                    serverTime: Date.now()
                }
            });
        }, WS_TICK_MS);

        ws.on('close', () => {
            console.log('Cliente WebSocket desconectado');
            clearInterval(intervalId);
        });

        ws.on('error', (err) => {
            console.error('Error WebSocket:', err.message);
        });
    });
}

module.exports = initWebSocket;