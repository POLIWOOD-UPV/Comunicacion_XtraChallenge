// ws_server.js
const WebSocket = require('ws');
const cronometro = require('./src/core/cronometro');

function initWebSocket(server) {
    const wss = new WebSocket.Server({ server });

    console.log('Servidor WebSocket inicializado');

    wss.on('connection', (ws) => {
        console.log('Cliente WebSocket conectado');

        // Enviar estado inicial
        ws.send(JSON.stringify({
            type: 'status',
            message: 'Conectado al servidor WebSocket'
        }));

        // Intervalo para enviar el tiempo del cronómetro
        const intervalId = setInterval(() => {
            const tiempo = cronometro.getTiempo();
            ws.send(JSON.stringify({
                type: 'time',
                payload: tiempo
            }));
        }, 50);

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