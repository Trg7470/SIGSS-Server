const router = require('express').Router();
const PacientesController = require('../controllers/pacientes.controller');

router.post('/buscar', PacientesController.buscar_paciente);
router.get('/listar', PacientesController.listar_pacientes);
router.get('/:Id_Paciente', PacientesController.consultar_paciente);
router.post('/registrar', PacientesController.registrar_paciente);
router.put('/:Id_Paciente', PacientesController.actualizar_paciente);

module.exports = router;