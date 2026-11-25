const express = require('express');
const router = express.Router();
const BitacoraController = require('../controllers/bitacora.controller');
const { verificarToken, verificarRol } = require('../middleware/auth.middleware');

router.post('/registrar', BitacoraController.registrar);
router.get('/consultar', verificarToken, verificarRol(3), BitacoraController.consultar);
router.get('/exportar', verificarToken, verificarRol(3), BitacoraController.exportar);

module.exports = router;