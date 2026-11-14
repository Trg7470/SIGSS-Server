const express = require('express');
const router = express.Router();
const ConsultaExternaController = require('../controllers/consulta_externa.controller');

router.post('/registrar', ConsultaExternaController.registrar);

module.exports = router;