const express = require('express');
const router = express.Router();
const AuthRoutes = require('./auth.routes');
const BitacoraRoutes = require('./bitacora.routes');
const InformeMensualRoutes = require('./informe_mensual.routes');
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
const UsuariosRoutes = require('./usuarios.routes');
const RolesRoutes = require('./roles.routes');
const TipoPersonalRoutes = require('./tipo_personal.routes');

router.use('/modules/nota-medica', NotaMedicaRoutes);
router.use('/modules/planificacion-familiar', PlanificacionFamiliarRoutes);
router.use('/modules/consulta-externa', ConsultaExternaRoutes);
router.use('/modules/salud-bucal', SaludBucalRoutes);
router.use('/modules/detecciones', DeteccionesRoutes);

router.use('/tipo-personal', TipoPersonalRoutes);
router.use('/roles', RolesRoutes);
router.use('/usuarios', UsuariosRoutes);
router.use('/bitacora', BitacoraRoutes);
router.use('/informe-mensual', InformeMensualRoutes);
router.use('/documentos', DocumentosRoutes);
router.use('/catalogos', CatalogosRoutes);
router.use('/unidades', UnidadesRoutes);
router.use('/auth', AuthRoutes);
router.use('/pacientes', PacientesRoutes);
router.use('/prestadores', PrestadoresRoutes);

module.exports = router;