const router = require('express').Router();
const PrestadoresController = require('../controllers/prestadores.controller');

router.get('/:id_usuario', PrestadoresController.por_usuario);

module.exports = router;