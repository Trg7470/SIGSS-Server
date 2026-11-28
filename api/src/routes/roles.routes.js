const express = require('express');
const router = express.Router();
const RolesController = require('../controllers/roles.controller');

router.get('/', RolesController.listar);

module.exports = router;