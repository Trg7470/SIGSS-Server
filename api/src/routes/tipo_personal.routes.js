const express = require('express');
const router = express.Router();
const TipoPersonalController = require('../controllers/tipo_personal.controller');

router.get('/', TipoPersonalController.listar);

module.exports = router;