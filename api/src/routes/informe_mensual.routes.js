const express = require('express');
const router = express.Router();
const InformeMensualController = require('../controllers/informe_mensual.controller');

// SIGSS | Rutas de Informe Mensual (reportes)
// Mismo patrón que bitacora.routes.js.

router.get('/modulos', InformeMensualController.modulos);
router.get('/exportar', InformeMensualController.exportar);

module.exports = router;