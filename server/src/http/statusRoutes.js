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
    const syncStatus = timeSync.getStatus();

    res.json({
        system: SYSTEM_NAME,
        serverTime: Date.now(),
        cronometro: {
            tiempo
        },
        timeSync: syncStatus
    });
});

module.exports = router;