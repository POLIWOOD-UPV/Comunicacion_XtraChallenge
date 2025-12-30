// src/core/cronometro.js

let startTime = null;      // instante en que se inicia
let accumulated = 0;      // tiempo acumulado en ms
let running = false;

// Inicia o reanuda el cronómetro
function start() {
    if (!running) {
        startTime = Date.now();
        running = true;
    }
}

// Pausa el cronómetro
function pause() {
    if (running) {
        accumulated += Date.now() - startTime;
        running = false;
    }
}

// Detiene y reinicia el cronómetro
function stop() {
    accumulated = 0;
    running = false;
    startTime = null;
}

// Obtiene el tiempo actual del cronómetro
function getTiempo() {
    let elapsed = accumulated;

    if (running) {
        elapsed += Date.now() - startTime;
    }

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
    getTiempo
};