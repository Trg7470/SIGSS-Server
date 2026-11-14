const express = require('express');
const router = express.Router();
const AuthRoutes = require('./auth.routes');
const UnidadesRoutes = require('./unidades.routes');
const PacientesRoutes = require('./pacientes.routes'); 
const PrestadoresRoutes = require('./prestadores.routes'); 
const CatalogosRoutes = require('./catalogos.routes');
const ConsultaExternaRoutes = require('./consulta_externa.routes');

router.use('/modules/consulta-externa', ConsultaExternaRoutes);


router.use('/catalogos', CatalogosRoutes);
router.use('/unidades', UnidadesRoutes);
router.use('/auth', AuthRoutes);
router.use('/pacientes', PacientesRoutes);
router.use('/prestadores', PrestadoresRoutes);

module.exports = router;
