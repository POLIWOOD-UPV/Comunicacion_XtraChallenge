// src/http/eventRoutes.js
const express = require('express');
const router = express.Router();
const cronometro = require('../core/cronometro');
const csvLogger = require('../utils/csvLogger');

// Utilitat per a obtindre info del dispositiu
function getDeviceInfo(req) {
    return {
        deviceId: req.body?.deviceId || 'WEB_CLIENT',
        timestamp: req.body?.timestamp || Date.now(),
        action: req.body?.action || 'unknown'
    };
}

function sendTransitionResponse(res, {
    transition,
    tiempo,
    deviceId,
    successMessage,
    conflictMessage
}) {
    const isConflict = !transition.changed;

    return res.status(isConflict ? 409 : 200).json({
        status: isConflict ? 'conflict' : 'ok',
        message: isConflict ? conflictMessage : successMessage,
        transition,
        state: transition.currentState,
        elapsedMs: transition.elapsedMs,
        tiempo,
        deviceId,
        serverTime: Date.now()
    });
}

// ===== START =====
router.post('/start', (req, res) => {
    const { deviceId, timestamp } = getDeviceInfo(req);

    const transition = cronometro.start();
    const tiempo = cronometro.getTiempo();

    if (transition.changed && transition.previousState === cronometro.STATES.STOPPED) {
        csvLogger.startNewSession({ deviceId });
    }

    console.log(
        `[START] device=${deviceId} ts=${timestamp} ${transition.previousState}->${transition.currentState} changed=${transition.changed}`
    );

    return sendTransitionResponse(res, {
        transition,
        tiempo,
        deviceId,
        successMessage: 'Cronómetro iniciado/reanudado',
        conflictMessage: 'Start ignorado: cronómetro ya estaba en marcha'
    });
});

// ===== PAUSE =====
router.post('/pause', (req, res) => {
    const { deviceId, timestamp } = getDeviceInfo(req);

    const transition = cronometro.pause();
    const tiempo = cronometro.getTiempo();

    console.log(
        `[PAUSE] device=${deviceId} ts=${timestamp} ${transition.previousState}->${transition.currentState} changed=${transition.changed}`
    );

    return sendTransitionResponse(res, {
        transition,
        tiempo,
        deviceId,
        successMessage: 'Cronómetro pausado',
        conflictMessage: 'Pausa ignorada: cronómetro no estaba en marcha'
    });
});

// ===== STOP =====
router.post('/stop', (req, res) => {
    const { deviceId, timestamp } = getDeviceInfo(req);

    const tiempo = cronometro.getTiempo();
    const transition = cronometro.stop();

    console.log(
        `[STOP] device=${deviceId} ts=${timestamp} tiempo=${tiempo.min}:${tiempo.sec}:${tiempo.ms} ${transition.previousState}->${transition.currentState} changed=${transition.changed}`
    );
    
    // Guardar línea final en CSV
    if (transition.changed) {
        csvLogger.saveSession({ deviceId, tiempo });
    }

    return sendTransitionResponse(res, {
        transition,
        tiempo,
        deviceId,
        successMessage: 'Cronómetro detenido',
        conflictMessage: 'Stop ignorado: cronómetro ya estaba detenido'
    });
});


module.exports = router;