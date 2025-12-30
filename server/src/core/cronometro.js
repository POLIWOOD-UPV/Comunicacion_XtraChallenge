// let tiempo = 0;
// let intervalId = null;

let startTime = 0;
let elapsed = 0;
let timerInterval = null

function start() {
    if (!timerInterval) {
        startTime = Date.now() - elapsed;
        timerInterval= setInterval(() => {
            elapsed = Date.now() -startTime;
        }, 10);
    }
}

function pause() {
    if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    }
}

function stop() {
    pause();
    elapsed = 0;
}

function getTiempo() {
    const ms = elapsed % 1000;
    const totalSeconds = Math.floor(elapsed / 1000);
    const sec = totalSeconds % 60
    const min = Math.floor(totalSeconds / 60);
    return {min,sec,ms};
}

module.exports = {start,pause,stop,getTiempo};