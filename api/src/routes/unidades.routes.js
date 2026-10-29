const router = require('express').Router();
const UnidadesController = require('../controllers/unidades.controller');

router.get('/', UnidadesController.all);
module.exports = router;