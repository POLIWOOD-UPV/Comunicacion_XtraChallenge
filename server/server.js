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

// ===== Servidor =====
const server = app.listen(PORT, () => {
    console.log(`Servidor Node ejecutándose en el puerto ${PORT}`);
});

// ===== Export (para WebSocket o tests) =====
initWebSocket(server);
module.exports = { app, server };