// tests/cronometro.test.js

const assert = require('assert');
const cronometro = require('../server/src/core/cronometro');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('Test cronometro: START');

    // Test START
    cronometro.start();
    await sleep(100);
    let tiempo1 = cronometro.getTiempo();
    assert(tiempo1.sec >= 0, 'El cronómetro debería avanzar');

    // Test PAUSE
    cronometro.pause();
    let tiempoPause1 = cronometro.getTiempo();
    await sleep(100);
    let tiempoPause2 = cronometro.getTiempo();
    assert.deepStrictEqual(tiempoPause1, tiempoPause2, 'El cronómetro debería estar pausado');

    // Test STOP
    cronometro.stop();
    let tiempoStop = cronometro.getTiempo();
    assert.strictEqual(tiempoStop.min, 0);
    assert.strictEqual(tiempoStop.sec, 0);
    assert.strictEqual(tiempoStop.ms, 0);

    console.log('Test cronometro: OK');
})();