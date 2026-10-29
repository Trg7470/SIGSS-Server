const router = require('express').Router();
const CatalogosController = require('../controllers/catalogos.controller');

router.get('/diagnosticos/buscar', CatalogosController.buscar_diagnosticos);
router.get('/', CatalogosController.all);

module.exports = router;