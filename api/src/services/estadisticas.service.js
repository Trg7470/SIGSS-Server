const Estadisticas = require('../models/estadisticas.model');

class EstadisticasService {
    static async consultas_por_modulo(filtros) {
        return Estadisticas.consultas_por_modulo(filtros);
    }
    static async consultas_por_medico(filtros) {
        return Estadisticas.consultas_por_medico(filtros);
    }
    static async primera_vez_subsecuente(filtros) {
        return Estadisticas.primera_vez_subsecuente(filtros);
    }
    static async tendencia_mensual(filtros) {
        return Estadisticas.tendencia_mensual(filtros);
    }
    static async diagnosticos_frecuentes(filtros) {
        return Estadisticas.diagnosticos_frecuentes(filtros);
    }
    static async medicamentos_mas_usados(filtros) {
        return Estadisticas.medicamentos_mas_usados(filtros);
    }
    static async metodos_anticonceptivos(filtros) {
        return Estadisticas.metodos_anticonceptivos(filtros);
    }
    static async salud_bucal(filtros) {
        return Estadisticas.salud_bucal(filtros);
    }
    static async detecciones(filtros) {
        return Estadisticas.detecciones(filtros);
    }
}

module.exports = EstadisticasService;