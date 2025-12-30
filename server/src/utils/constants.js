// src/utils/constants.js

module.exports = {
    // ===== Sistema =====
    SYSTEM_NAME: process.env.SYSTEM_NAME || 'XtraChrono',

    // ===== Dispositivos =====
    DEFAULT_DEVICE_ID: process.env.DEFAULT_DEVICE_ID || 'WEB_CLIENT',

    // ===== Acciones =====
    ACTIONS: {
        START: 'start',
        PAUSE: 'pause',
        STOP: 'stop'
    },

    // ===== WebSocket =====
    WS_MESSAGES: {
        STATUS: 'status',
        TIME: 'time',
        ERROR: 'error'
    },

    // ===== Estados del sistema =====
    STATES: {
        RUNNING: 'running',
        PAUSED: 'paused',
        STOPPED: 'stopped'
    }
};