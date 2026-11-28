const EstadisticasService = require('../services/estadisticas.service');

function obtener_filtros(req) {
    const { fecha_inicial, fecha_final, prestador, limite } = req.query;
    return { fecha_inicial, fecha_final, prestador, limite };
}

function manejar(metodo, mensaje_error) {
    return async (req, res) => {
        try {
            const resultado = await EstadisticasService[metodo](obtener_filtros(req));
            res.status(200).json({ success: true, data: resultado });
        } catch (error) {
            console.error(mensaje_error, error);
            res.status(500).json({ success: false, error: mensaje_error });
        }
    };
}

class EstadisticasController {
    static consultas_por_modulo = manejar('consultas_por_modulo', 'Error al obtener consultas por módulo');
    static consultas_por_medico = manejar('consultas_por_medico', 'Error al obtener consultas por médico');
    static primera_vez_subsecuente = manejar('primera_vez_subsecuente', 'Error al obtener primera vez vs subsecuente');
    static tendencia_mensual = manejar('tendencia_mensual', 'Error al obtener la tendencia mensual');
    static diagnosticos_frecuentes = manejar('diagnosticos_frecuentes', 'Error al obtener los diagnósticos frecuentes');
    static medicamentos_mas_usados = manejar('medicamentos_mas_usados', 'Error al obtener los medicamentos más usados');
    static metodos_anticonceptivos = manejar('metodos_anticonceptivos', 'Error al obtener los métodos anticonceptivos');
    static salud_bucal = manejar('salud_bucal', 'Error al obtener las estadísticas de salud bucal');
    static detecciones = manejar('detecciones', 'Error al obtener las estadísticas de detecciones');
}

module.exports = EstadisticasController;