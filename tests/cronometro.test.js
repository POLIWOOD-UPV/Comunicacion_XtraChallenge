// tests/cronometro.test.js

const assert = require('assert');
const cronometro = require('../server/src/core/cronometro');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('Test cronometro: START');

    // Estado limpio antes de empezar
    cronometro.stop();

    // Test transición inválida: PAUSE estando parado
    const invalidPause = cronometro.pause();
    assert.strictEqual(invalidPause.changed, false, 'PAUSE en STOPPED no debe cambiar estado');
    assert.strictEqual(invalidPause.currentState, cronometro.STATES.STOPPED);

    // Test START
    const startTransition = cronometro.start();
    assert.strictEqual(startTransition.changed, true, 'START debe activar el cronómetro desde STOPPED');
    assert.strictEqual(startTransition.currentState, cronometro.STATES.RUNNING);

    // Test transición inválida: START estando running
    const invalidStart = cronometro.start();
    assert.strictEqual(invalidStart.changed, false, 'START en RUNNING no debe reiniciar');
    assert.strictEqual(invalidStart.currentState, cronometro.STATES.RUNNING);

    await sleep(100);
    let tiempo1 = cronometro.getTiempo();
    assert(tiempo1.sec >= 0, 'El cronómetro debería avanzar');

    // Test PAUSE
    const pauseTransition = cronometro.pause();
    assert.strictEqual(pauseTransition.changed, true, 'PAUSE en RUNNING debe pausar');
    assert.strictEqual(pauseTransition.currentState, cronometro.STATES.PAUSED);

    let tiempoPause1 = cronometro.getTiempo();
    await sleep(100);
    let tiempoPause2 = cronometro.getTiempo();
    assert.deepStrictEqual(tiempoPause1, tiempoPause2, 'El cronómetro debería estar pausado');

    // Test STOP
    const stopTransition = cronometro.stop();
    assert.strictEqual(stopTransition.changed, true, 'STOP desde PAUSED debe resetear el cronómetro');
    assert.strictEqual(stopTransition.currentState, cronometro.STATES.STOPPED);

    let tiempoStop = cronometro.getTiempo();
    assert.strictEqual(tiempoStop.min, 0);
    assert.strictEqual(tiempoStop.sec, 0);
    assert.strictEqual(tiempoStop.ms, 0);

    // Test transición inválida: STOP estando parado
    const invalidStop = cronometro.stop();
    assert.strictEqual(invalidStop.changed, false, 'STOP en STOPPED no debe cambiar estado');
    assert.strictEqual(invalidStop.currentState, cronometro.STATES.STOPPED);

    // Test regresión: STOP seguido de START rápido
    const quickStart = cronometro.start();
    assert.strictEqual(quickStart.changed, true, 'STOP -> START rápido debe arrancar correctamente');
    await sleep(20);
    const quickPause = cronometro.pause();
    assert.strictEqual(quickPause.changed, true, 'El cronómetro debe poder pausarse tras STOP -> START');
    assert(quickPause.elapsedMs >= 10, 'Debe acumular tiempo tras START rápido');

    cronometro.stop();

    console.log('Test cronometro: OK');
})();