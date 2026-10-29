const router = require('express').Router();
const PacientesController = require('../controllers/pacientes.controller');

router.post('/buscar', PacientesController.buscar_paciente);

module.exports = router;