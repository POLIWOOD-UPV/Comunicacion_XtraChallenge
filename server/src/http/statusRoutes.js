// src/http/statusRoutes.js

const express = require('express');
const router = express.Router();

const cronometro = require('../core/cronometro');
const timeSync = require('../core/timeSync');
const { SYSTEM_NAME } = require('../utils/constants');

/**
 * Estado general del sistema
 */
router.get('/status', (req, res) => {
    const tiempo = cronometro.getTiempo();
    const state = cronometro.getState();
    const elapsedMs = cronometro.getElapsedMs();
    const syncStatus = timeSync.getStatus();

    res.json({
        status: 'ok',
        system: SYSTEM_NAME,
        serverTime: Date.now(),
        state,
        elapsedMs,
        tiempo,
        cronometro: {
            state,
            elapsedMs,
            tiempo
        },
        timeSync: syncStatus
    });
});

module.exports = router;