// src/http/eventRoutes.js
const express = require('express');
const router = express.Router();
const cronometro = require('../core/cronometro');

// Utilitat per a obtindre info del dispositiu
function getDeviceInfo(req) {
    return {
        deviceId: req.body?.deviceId || 'WEB_CLIENT',
        timestamp: req.body?.timestamp || Date.now(),
        action: req.body?.action || 'unknown'
    };
}

// ===== START =====
router.post('/start', (req, res) => {
    const { deviceId, timestamp } = getDeviceInfo(req);

    cronometro.start();

    console.log(`[START] device=${deviceId} ts=${timestamp}`);

    res.json({
        status: 'ok',
        message: 'Cronómetro iniciado',
        deviceId,
        serverTime: Date.now()
    });
});

// ===== PAUSE =====
router.post('/pause', (req, res) => {
    const { deviceId, timestamp } = getDeviceInfo(req);

    cronometro.pause();

    console.log(`[PAUSE] device=${deviceId} ts=${timestamp}`);

    res.json({
        status: 'ok',
        message: 'Cronómetro pausado',
        deviceId,
        serverTime: Date.now()
    });
});

// ===== STOP =====
router.post('/stop', (req, res) => {
    const { deviceId, timestamp } = getDeviceInfo(req);

    cronometro.stop();

    console.log(`[STOP] device=${deviceId} ts=${timestamp}`);

    res.json({
        status: 'ok',
        message: 'Cronómetro detenido',
        deviceId,
        serverTime: Date.now()
    });
});

// ===== STATUS / TIEMPO ACTUAL =====
router.get('/status', (req, res) => {
    const tiempo = cronometro.getTiempo();

    res.json({
        status: 'ok',
        tiempo,
        serverTime: Date.now()
    });
});

module.exports = router;