const express = require('express');
const router = express.Router();
const ConsultaExternaController = require('../controllers/consulta_externa.controller');

router.post('/registrar', ConsultaExternaController.registrar);

router.get('/historial', ConsultaExternaController.buscar_historial);
router.get('/historial/:id_consulta', ConsultaExternaController.obtener_detalle);

module.exports = router;