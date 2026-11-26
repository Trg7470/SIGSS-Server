const express = require('express');
const router = express.Router();
const usuarios_controller = require('../controllers/usuarios.controller');
const { verificarToken, verificarRol } = require('../middleware/auth.middleware');

router.get('/', verificarToken, verificarRol(3), usuarios_controller.listar);
router.get('/generar-contrasena', verificarToken, verificarRol(3), usuarios_controller.generar_contrasena);
router.get('/:id', verificarToken, verificarRol(3), usuarios_controller.obtener_por_id);
router.post('/', verificarToken, verificarRol(3), usuarios_controller.crear);
router.put('/:id', verificarToken, verificarRol(3), usuarios_controller.actualizar);
router.patch('/:id/estado', verificarToken, verificarRol(3), usuarios_controller.cambiar_estado);
router.patch('/:id/contrasena', verificarToken, verificarRol(3), usuarios_controller.cambiar_contrasena);

module.exports = router;    