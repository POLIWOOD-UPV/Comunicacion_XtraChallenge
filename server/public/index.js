const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const tiempoSpan = document.getElementById('tiempo');

startBtn.onclick = async () => {
    await fetch('/start', { method: 'POST'});
    updateTiempo();
};

pauseBtn.onclick = async () => {
    await fetch('/pause', { method: 'POST'});
    updateTiempo();
};

stopBtn.onclick = async () => {
    await fetch('/stop', { method: 'POST'});
    updateTiempo();
};

async function updateTiempo() {
    const res = await fetch('/tiempo');
    const data = await res.json();
    const t = data.tiempo;
    const min = String(t.min).padStart(2, '0');
    const sec = String(t.sec).padStart(2, '0');
    const ms = String(t.ms).padStart(3, '0');
    tiempoSpan.textContent = `${min}:${sec}:${ms} s`;
}

setInterval(updateTiempo, 50);