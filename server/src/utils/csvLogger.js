const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');

if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

let currentSessionFile = null;
let startTime = null; 

function startNewSession({ deviceId }) {
    startTime = new Date().toISOString(); 
    const timestamp = startTime.replace(/:/g, '-');
    const filename = `cronometro_${deviceId}_${timestamp}.csv`;
    currentSessionFile = path.join(DATA_DIR, filename);

    const header = 'deviceId,startTime,min,sec,ms\n';
    fs.writeFileSync(currentSessionFile, header);

    const row = `${deviceId},${startTime},0,0,0\n`;
    fs.appendFileSync(currentSessionFile, row);
}

function saveSession({ deviceId, tiempo }) {
    if (!currentSessionFile || !startTime) return;

    const stopTime = new Date().toISOString();
    const row = `${deviceId},${stopTime},${tiempo.min},${tiempo.sec},${tiempo.ms}\n`;
    fs.appendFileSync(currentSessionFile, row);

    currentSessionFile = null;
    startTime = null;
}

module.exports = {
    startNewSession,
    saveSession
};
