const { mysqlPool } = require('../config/mysql');

/**
 * SIGSS | Modelo de Informe Mensual (reportes)
 *
 * Sigue el mismo patrón que bitacora.model.js: toda la lógica de
 * agregación vive en las vistas de MySQL (vista_informe_mensual_*);
 * este modelo solo selecciona la fila ya calculada para la unidad,
 * módulo, mes y año solicitados.
 */

const VISTAS_POR_MODULO = {
    planificacion_familiar: 'vista_informe_mensual_planificacion_familiar',
    detecciones: 'vista_informe_mensual_detecciones',
    salud_bucal: 'vista_informe_mensual_salud_bucal',
    consulta_externa: 'vista_informe_mensual_consulta_externa',
};

class InformeMensual {
    /**
     * Obtiene los valores agregados de un módulo para una unidad/mes/año.
     * Si no hubo consultas capturadas en ese periodo, la vista no regresa
     * fila: en ese caso se responde un objeto vacío (el servicio de Excel
     * deja todas las celdas en blanco, no truena).
     */
    static async calcularTotales(modulo, idUnidad, anio, mes) {
        const vista = VISTAS_POR_MODULO[modulo];
        if (!vista) {
            throw new Error(`Módulo de informe mensual no reconocido: ${modulo}`);
        }

        const [filas] = await mysqlPool.query(
            `SELECT * FROM ${vista} WHERE Id_Unidad = ? AND Anio = ? AND Mes = ? LIMIT 1`,
            [idUnidad, anio, mes]
        );

        if (!filas.length) {
            return {};
        }

        const { Id_Unidad, Anio, Mes, ...valores } = filas[0];
        return valores;
    }

    static async obtenerUnidad(idUnidad) {
        const [filas] = await mysqlPool.query(
            'SELECT Id_Unidad, CLUES, Nombre FROM Unidades WHERE Id_Unidad = ? LIMIT 1',
            [idUnidad]
        );
        return filas[0] || null;
    }
}

module.exports = InformeMensual;