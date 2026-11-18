const express = require('express');
const router = express.Router();
const PlanificacionFamiliarController = require('../controllers/planificacion_familiar.controller');

router.post('/registrar', PlanificacionFamiliarController.registrar);

router.get('/historial', PlanificacionFamiliarController.buscar_historial);
router.get('/historial/:id_consulta', PlanificacionFamiliarController.obtener_detalle);

module.exports = router;