const express = require('express');
const router = express.Router();
const {ExportarDocumento,} = require('../controllers/documentos.controller');

router.post('/exportar', ExportarDocumento);

module.exports = router;
