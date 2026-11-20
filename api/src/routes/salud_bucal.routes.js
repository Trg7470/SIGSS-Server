const express = require('express');
const router = express.Router();
const SaludBucalController = require('../controllers/salud_bucal.controller');

router.post('/registrar', SaludBucalController.registrar);

router.get('/historial', SaludBucalController.buscar_historial);
router.get('/historial/:id_consulta', SaludBucalController.obtener_detalle);

module.exports = router;
