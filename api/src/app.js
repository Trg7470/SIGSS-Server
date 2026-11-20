const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/index')
const cookieparser = require('cookie-parser');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(cookieparser());
app.use('/api', routes);
app.use('/api/data/', express.static(path.join(__dirname, 'data')));

app.get("/", (req, res) => {
    res.json({
        mensaje: 'API del Sistema SIGSS funcionando correctamente.'
    });
});

module.exports = app;