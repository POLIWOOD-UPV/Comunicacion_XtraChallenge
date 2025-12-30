// src/core/timeSync.js

const logger = require('../utils/logger');

let offsetMs = 0;           // desfase estimado cliente-servidor
let lastSync = null;        // última sincronización

/**
 * Calcula el desfase temporal estimado.
 * @param {number} clientSendTime - timestamp enviado por el cliente
 * @param {number} clientReceiveTime - timestamp al recibir respuesta
 * @param {number} serverTime - timestamp del servidor
 */
function calculateOffset(clientSendTime, clientReceiveTime, serverTime) {
    const roundTrip = clientReceiveTime - clientSendTime;
    offsetMs = serverTime - (clientSendTime + roundTrip / 2);
    lastSync = Date.now();

    logger.info(
        `TimeSync actualizado | offset=${offsetMs}ms | RTT=${roundTrip}ms`
    );

    return offsetMs;
}

/**
 * Devuelve el offset estimado actual
 */
function getOffset() {
    return offsetMs;
}

/**
 * Devuelve información de sincronización
 */
function getStatus() {
    return {
        offsetMs,
        lastSync
    };
}

module.exports = {
    calculateOffset,
    getOffset,
    getStatus
};