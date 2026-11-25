const express = require('express');
const router = express.Router();
const AuthRoutes = require('./auth.routes');
const BitacoraRoutes = require('./bitacora.routes');
const UnidadesRoutes = require('./unidades.routes');
const PacientesRoutes = require('./pacientes.routes');
const PrestadoresRoutes = require('./prestadores.routes');
const CatalogosRoutes = require('./catalogos.routes');
const ConsultaExternaRoutes = require('./consulta_externa.routes');
const PlanificacionFamiliarRoutes = require('./planificacion_familiar.routes');
const SaludBucalRoutes = require('./salud_bucal.routes');
const DocumentosRoutes = require('./documentos.routes');
const NotaMedicaRoutes = require('./nota_medica.routes');
const DeteccionesRoutes = require('./detecciones.routes');

router.use('/modules/nota-medica', NotaMedicaRoutes);
router.use('/modules/planificacion-familiar', PlanificacionFamiliarRoutes);
router.use('/modules/consulta-externa', ConsultaExternaRoutes);
router.use('/modules/salud-bucal', SaludBucalRoutes);
router.use('/modules/detecciones', DeteccionesRoutes);

router.use('/bitacora', BitacoraRoutes);
router.use('/documentos', DocumentosRoutes);
router.use('/catalogos', CatalogosRoutes);
router.use('/unidades', UnidadesRoutes);
router.use('/auth', AuthRoutes);
router.use('/pacientes', PacientesRoutes);
router.use('/prestadores', PrestadoresRoutes);

module.exports = router;