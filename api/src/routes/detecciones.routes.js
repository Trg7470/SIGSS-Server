const express = require('express');
const router = express.Router();
const DeteccionesController = require('../controllers/detecciones.controller');

router.post('/registrar', DeteccionesController.registrar);
router.get('/historial', DeteccionesController.buscar_historial);
router.get('/historial/:id_consulta', DeteccionesController.obtener_detalle);

module.exports = router;