const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const routes = require('./routes/index');

app.use(cors());
app.use(express.json());
// Archivos estáticos de prueba de SIGSS.
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/api', routes);

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API del Sistema SIGSS funcionando correctamente.',
    });
});

module.exports = app;
