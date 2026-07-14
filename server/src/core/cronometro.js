// src/core/cronometro.js

const STATES = {
    STOPPED: 'stopped',
    RUNNING: 'running',
    PAUSED: 'paused'
};

let startHrTime = null;    // instante de inicio (hrtime en ns)
let accumulated = 0;       // tiempo acumulado en ms
let state = STATES.STOPPED;

function nowHrNs() {
    return process.hrtime.bigint();
}

function runningElapsedMs() {
    if (startHrTime === null) {
        return 0;
    }

    const diffNs = nowHrNs() - startHrTime;
    return Number(diffNs / 1000000n);
}

function getElapsedMs() {
    let elapsed = accumulated;

    if (state === STATES.RUNNING && startHrTime !== null) {
        elapsed += runningElapsedMs();
    }

    return Math.max(0, elapsed);
}

function getState() {
    return state;
}

function buildTransition(previousState, changed) {
    return {
        previousState,
        currentState: state,
        changed,
        elapsedMs: getElapsedMs()
    };
}

// Inicia o reanuda el cronómetro
function start() {
    const previousState = state;

    if (state !== STATES.RUNNING) {
        startHrTime = nowHrNs();
        state = STATES.RUNNING;
        return buildTransition(previousState, true);
    }

    return buildTransition(previousState, false);
}

// Pausa el cronómetro
function pause() {
    const previousState = state;

    if (state === STATES.RUNNING && startHrTime !== null) {
        accumulated += runningElapsedMs();
        startHrTime = null;
        state = STATES.PAUSED;
        return buildTransition(previousState, true);
    }

    return buildTransition(previousState, false);
}

// Detiene y reinicia el cronómetro
function stop() {
    const previousState = state;
    const changed = state !== STATES.STOPPED;

    accumulated = 0;
    startHrTime = null;
    state = STATES.STOPPED;

    return buildTransition(previousState, changed);
}

// Obtiene el tiempo actual del cronómetro
function getTiempo() {
    const elapsed = getElapsedMs();
    const ms = elapsed % 1000;
    const totalSeconds = Math.floor(elapsed / 1000);
    const sec = totalSeconds % 60;
    const min = Math.floor(totalSeconds / 60);

    return { min, sec, ms };
}

module.exports = {
    start,
    pause,
    stop,
    getTiempo,
    getElapsedMs,
    getState,
    STATES
};