const express = require('express');
const router = express.Router();
const EstadisticasController = require('../controllers/estadisticas.controller');
const { verificarToken, verificarRol } = require('../middleware/auth.middleware');

const ID_ROL_ADMINISTRADOR = 3;
const ID_ROL_JEFE_JURISDICCION = 4;

router.get(
    '/consultas-por-modulo',
    verificarToken,
    verificarRol(ID_ROL_ADMINISTRADOR, ID_ROL_JEFE_JURISDICCION),
    EstadisticasController.consultas_por_modulo
);

router.get(
    '/consultas-por-medico',
    verificarToken,
    verificarRol(ID_ROL_ADMINISTRADOR, ID_ROL_JEFE_JURISDICCION),
    EstadisticasController.consultas_por_medico
);

router.get(
    '/primera-vez-subsecuente',
    verificarToken,
    verificarRol(ID_ROL_ADMINISTRADOR, ID_ROL_JEFE_JURISDICCION),
    EstadisticasController.primera_vez_subsecuente
);

router.get(
    '/tendencia-mensual',
    verificarToken,
    verificarRol(ID_ROL_ADMINISTRADOR, ID_ROL_JEFE_JURISDICCION),
    EstadisticasController.tendencia_mensual
);

router.get(
    '/diagnosticos-frecuentes',
    verificarToken,
    verificarRol(ID_ROL_ADMINISTRADOR, ID_ROL_JEFE_JURISDICCION),
    EstadisticasController.diagnosticos_frecuentes
);

router.get(
    '/medicamentos-mas-usados',
    verificarToken,
    verificarRol(ID_ROL_ADMINISTRADOR, ID_ROL_JEFE_JURISDICCION),
    EstadisticasController.medicamentos_mas_usados
);

router.get(
    '/metodos-anticonceptivos',
    verificarToken,
    verificarRol(ID_ROL_ADMINISTRADOR, ID_ROL_JEFE_JURISDICCION),
    EstadisticasController.metodos_anticonceptivos
);

router.get(
    '/salud-bucal',
    verificarToken,
    verificarRol(ID_ROL_ADMINISTRADOR, ID_ROL_JEFE_JURISDICCION),
    EstadisticasController.salud_bucal
);

router.get(
    '/detecciones',
    verificarToken,
    verificarRol(ID_ROL_ADMINISTRADOR, ID_ROL_JEFE_JURISDICCION),
    EstadisticasController.detecciones
);

module.exports = router;