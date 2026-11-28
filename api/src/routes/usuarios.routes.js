const express = require('express');
const router = express.Router();
const UsuariosController = require('../controllers/usuarios.controller');
const { verificarToken, verificarRol } = require('../middleware/auth.middleware');

router.get('/', verificarToken, verificarRol(3), UsuariosController.listar);
router.get('/generar-contrasena', verificarToken, verificarRol(3), UsuariosController.generar_contrasena);
router.get('/:id', verificarToken, verificarRol(3), UsuariosController.obtener_por_id);
router.post('/', verificarToken, verificarRol(3), UsuariosController.crear);
router.put('/:id', verificarToken, verificarRol(3), UsuariosController.actualizar);
router.patch('/:id/estado', verificarToken, verificarRol(3), UsuariosController.cambiar_estado);
router.patch('/:id/contrasena', verificarToken, verificarRol(3), UsuariosController.cambiar_contrasena);

module.exports = router;