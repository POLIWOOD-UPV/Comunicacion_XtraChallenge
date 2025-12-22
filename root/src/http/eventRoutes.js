var express = require('express');
var router = express.Router();
const cronometro = require('../core/cronometro');

router.post('/start', (req, res) => {
    cronometro.start();
    console.log('Iniciar evento');
    res.json({status: 'Evento iniciado'});
});

router.post('/pause', (req,res) => {
    cronometro.pause();
    console.log('Pausar evento');
    res.json({status:'Evento pausado'});
});

router.post('/stop', (req,res) => {
    cronometro.stop();
    console.log('Detener evento');
    res.json({status:'Evento detenido'});
});

router.get('/tiempo', (req, res) => {
    const tiempo = cronometro.getTiempo();
    res.json({tiempo});
});

module.exports = router;