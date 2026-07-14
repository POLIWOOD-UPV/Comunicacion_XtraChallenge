// index.js

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn  = document.getElementById('stopBtn');
const tiempoSpan = document.getElementById('tiempo');
const statusSpan = document.getElementById('status');

let currentState = 'unknown';
let baseElapsedMs = 0;
let baseServerTime = Date.now();
let renderLoopStarted = false;
const TARGET_RENDER_FPS = 60; // Cambia este valor para acelerar o ralentizar el repintado visual.
const FRAME_INTERVAL_MS = 1000 / TARGET_RENDER_FPS;
let lastRenderAt = 0;

function setStatusMessage(message, kind = 'info') {
    statusSpan.textContent = message;
    statusSpan.classList.remove('status-info', 'status-ok', 'status-conflict', 'status-error');
    statusSpan.classList.add(`status-${kind}`);
}

function updateButtonsByState(state) {
    if (state === 'running') {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        stopBtn.disabled = false;
        return;
    }

    if (state === 'paused') {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = false;
        return;
    }

    if (state === 'stopped') {
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        stopBtn.disabled = true;
        return;
    }

    startBtn.disabled = false;
    pauseBtn.disabled = false;
    stopBtn.disabled = false;
}

function tiempoToElapsedMs(tiempo) {
    if (!tiempo) {
        return 0;
    }

    return (tiempo.min * 60000) + (tiempo.sec * 1000) + tiempo.ms;
}

function elapsedMsToTiempo(elapsedMs) {
    const safeElapsed = Math.max(0, Math.floor(elapsedMs));
    const ms = safeElapsed % 1000;
    const totalSeconds = Math.floor(safeElapsed / 1000);
    const sec = totalSeconds % 60;
    const min = Math.floor(totalSeconds / 60);
    return { min, sec, ms };
}

function getDisplayedElapsedMs() {
    if (currentState === 'running') {
        const now = Date.now();
        return baseElapsedMs + Math.max(0, now - baseServerTime);
    }

    return baseElapsedMs;
}

function renderTimeLoop() {
    const now = performance.now();

    if ((now - lastRenderAt) >= FRAME_INTERVAL_MS) {
        lastRenderAt = now;
        const displayElapsed = getDisplayedElapsedMs();
        tiempoSpan.textContent = formatTime(elapsedMsToTiempo(displayElapsed));
    }

    requestAnimationFrame(renderTimeLoop);
}

function ensureRenderLoop() {
    if (renderLoopStarted) {
        return;
    }

    renderLoopStarted = true;
    requestAnimationFrame(renderTimeLoop);
}

function formatTime(tiempo) {
    const minStr = String(tiempo.min).padStart(2, '0');
    const secStr = String(tiempo.sec).padStart(2, '0');
    const msStr  = String(tiempo.ms).padStart(3, '0');
    return `${minStr}:${secStr}:${msStr}`;
}

function applyStateFromPayload(payload) {
    if (!payload) {
        return;
    }

    if (typeof payload.elapsedMs === 'number') {
        baseElapsedMs = payload.elapsedMs;
    } else if (payload.tiempo) {
        baseElapsedMs = tiempoToElapsedMs(payload.tiempo);
    }

    baseServerTime = typeof payload.serverTime === 'number' ? payload.serverTime : Date.now();

    if (payload.state) {
        currentState = payload.state;
        updateButtonsByState(currentState);
    }
}

async function refreshStatus() {
    try {
        const response = await fetch('/status');
        if (!response.ok) {
            return;
        }

        const payload = await response.json();
        applyStateFromPayload(payload);
    } catch (err) {
        // no-op: el estado en vivo seguirá llegando por WS cuando esté disponible
    }
}

// =======================
// HTTP: control del cronómetro
// =======================

async function sendCommand(url) {
    try {
        const response = await fetch(url, { method: 'POST' });
        const payload = await response.json();

        applyStateFromPayload(payload);
        setStatusMessage(payload.message || 'Comando procesado', response.ok ? 'ok' : 'conflict');

        if (!response.ok) {
            return;
        }
    } catch (err) {
        setStatusMessage('Error de comunicación', 'error');
    }
}

startBtn.onclick = () => sendCommand('/start');
pauseBtn.onclick = () => sendCommand('/pause');
stopBtn.onclick  = () => sendCommand('/stop');

// =======================
// WebSocket: visualización en tiempo real
// =======================

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${window.location.host}`);

socket.onopen = () => {
    setStatusMessage('Conectado al servidor', 'ok');
    refreshStatus();
};

socket.onclose = () => {
    setStatusMessage('Servidor desconectado', 'error');
};

socket.onerror = () => {
    setStatusMessage('Error de conexión', 'error');
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'time') {
        if (data.payload && data.payload.tiempo) {
            applyStateFromPayload(data.payload);
        } else {
            applyStateFromPayload({
                tiempo: data.payload,
                elapsedMs: tiempoToElapsedMs(data.payload),
                state: currentState,
                serverTime: Date.now()
            });
        }
    }

    if (data.type === 'status' && data.message) {
        setStatusMessage(data.message, 'info');
    }
};

updateButtonsByState(currentState);
ensureRenderLoop();
refreshStatus();
setInterval(refreshStatus, 2000);