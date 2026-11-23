const express = require('express');
const router = express.Router();
const NotaMedicaController = require('../controllers/nota_medica.controller');

router.get('/historial/:id_consulta', NotaMedicaController.obtener_detalle);
router.put('/historial/:id_consulta', NotaMedicaController.guardar);
router.get('/medicamentos', NotaMedicaController.buscar_medicamentos);

module.exports = router;