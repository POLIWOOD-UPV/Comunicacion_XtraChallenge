// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const eventRoutes = require('./src/http/eventRoutes');
const statusRoutes = require('./src/http/statusRoutes');
const initWebSocket = require('./ws_server');

const app = express();

// ===== Configuración =====
const PORT = process.env.PORT || 3000;

// ===== Middlewares =====
app.use(cors());
app.use(express.json());

// ===== Rutas HTTP =====
app.use('/', eventRoutes);
app.use('/', statusRoutes);

// ===== Archivos estáticos =====
app.use(express.static('public'));

function startServer(port = PORT) {
    const server = app.listen(port, () => {
        console.log(`Servidor Node ejecutándose en el puerto ${port}`);
    });

    initWebSocket(server);
    return server;
}

if (require.main === module) {
    startServer();
}

module.exports = { app, startServer };