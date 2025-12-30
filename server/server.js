var express = require('express');
var app = express();
app.use(express.json());

var eventRoutes = require('./src/http/eventRoutes');
app.use('/', eventRoutes);

app.use(express.static('public'));

var server = app.listen(3000, function () {
    console.log('Servidor Node se está ejecutando..');
})