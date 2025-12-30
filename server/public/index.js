// index.js

const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn  = document.getElementById('stopBtn');
const tiempoSpan = document.getElementById('tiempo');
const statusSpan = document.getElementById('status');

// =======================
// HTTP: control del cronómetro
// =======================

async function sendCommand(url, button) {
    try {
        button.disabled = true;
        await fetch(url, { method: 'POST' });
    } catch (err) {
        statusSpan.textContent = 'Error de comunicación';
    } finally {
        setTimeout(() => button.disabled = false, 150);
    }
}

startBtn.onclick = () => sendCommand('/start', startBtn);
pauseBtn.onclick = () => sendCommand('/pause', pauseBtn);
stopBtn.onclick  = () => sendCommand('/stop', stopBtn);

// =======================
// WebSocket: visualización en tiempo real
// =======================

const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const socket = new WebSocket(`${protocol}://${window.location.host}`);

socket.onopen = () => {
    statusSpan.textContent = 'Conectado al servidor';
};

socket.onclose = () => {
    statusSpan.textContent = 'Servidor desconectado';
};

socket.onerror = () => {
    statusSpan.textContent = 'Error de conexión';
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'time') {
        const { min, sec, ms } = data.payload;

        const minStr = String(min).padStart(2, '0');
        const secStr = String(sec).padStart(2, '0');
        const msStr  = String(ms).padStart(3, '0');

        tiempoSpan.textContent = `${minStr}:${secStr}:${msStr}`;
    }

    if (data.type === 'status') {
        statusSpan.textContent = data.message;
    }
};