const express = require('express');
const router = express.Router();
const UnidadesRoutes = require('./unidades.routes');
const PacientesRoutes = require('./pacientes.routes'); 
const PrestadoresRoutes = require('./prestadores.routes'); 
const CatalogosRoutes = require('./catalogos.routes');
const AuthRoutes = require('./auth.routes');
const DocumentosRoutes = require('./documentos.routes');

router.use('/auth', AuthRoutes);
router.use('/documentos', DocumentosRoutes);
router.use('/pacientes', PacientesRoutes);
router.use('/prestadores', PrestadoresRoutes);
router.use('/catalogos', CatalogosRoutes);
router.use('/unidades', UnidadesRoutes);

module.exports = router;
