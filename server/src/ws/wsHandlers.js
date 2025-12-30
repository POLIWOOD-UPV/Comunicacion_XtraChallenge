// src/ws/wsHandlers.js

const { WS_MESSAGES } = require('../utils/constants');
const logger = require('../utils/logger');

/**
 * Envia un missatge d'estat al client WebSocket
 */
function sendStatus(ws, message) {
    const payload = {
        type: WS_MESSAGES.STATUS,
        message
    };

    ws.send(JSON.stringify(payload));
    logger.info(`WS STATUS enviado: ${message}`);
}

/**
 * Envia el temps actual del cronòmetre
 */
function sendTime(ws, tiempo) {
    const payload = {
        type: WS_MESSAGES.TIME,
        payload: tiempo
    };

    ws.send(JSON.stringify(payload));
}

/**
 * Envia un missatge d'error
 */
function sendError(ws, errorMessage) {
    const payload = {
        type: WS_MESSAGES.ERROR,
        message: errorMessage
    };

    ws.send(JSON.stringify(payload));
    logger.error(`WS ERROR: ${errorMessage}`);
}

module.exports = {
    sendStatus,
    sendTime,
    sendError
};