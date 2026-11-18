const express = require('express');
const router = express.Router();
const {exportar_documento} = require('../controllers/documentos.controller');

router.get('/exportar', exportar_documento);

module.exports = router;