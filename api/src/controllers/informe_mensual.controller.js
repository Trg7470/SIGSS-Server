const fs = require('fs');
const InformeMensual = require('../models/informe_mensual.model');
const { generar_xls_informe_mensual, MODULOS } = require('../services/documentos/generar_xls_informe_mensual.service');

/**
 * SIGSS | Controlador de Informe Mensual (reportes)
 *
 * Mismo patrón que BitacoraController: valida parámetros de la query,
 * arma los metadatos del encabezado, pide los totales al modelo y
 * genera el archivo con el servicio, para finalmente mandarlo con
 * res.download().
 */
class InformeMensualController {
    static async exportar(req, res) {
        try {
            const { modulo, mes, anio, id_unidad, responsable } = req.query;

            if (!modulo || !MODULOS[modulo]) {
                return res.status(400).json({
                    mensaje: 'Debes indicar un módulo válido (planificacion_familiar, detecciones, salud_bucal o consulta_externa).',
                });
            }
            if (!mes || !anio) {
                return res.status(400).json({ mensaje: 'Debes indicar mes y año.' });
            }

            const mesNum = parseInt(mes, 10);
            const anioNum = parseInt(anio, 10);
            if (Number.isNaN(mesNum) || mesNum < 1 || mesNum > 12) {
                return res.status(400).json({ mensaje: 'El mes debe ser un número entre 1 y 12.' });
            }

            // Si no se especifica unidad, se usa la unidad del usuario en sesión
            // (igual que el resto de los módulos de captura).
            const idUnidad = id_unidad ? parseInt(id_unidad, 10) : req.session?.usuario?.Id_Unidad;
            if (!idUnidad) {
                return res.status(400).json({ mensaje: 'No se pudo determinar la unidad.' });
            }

            const unidad = await InformeMensual.obtenerUnidad(idUnidad);
            if (!unidad) {
                return res.status(404).json({ mensaje: 'Unidad no encontrada.' });
            }

            const valores = await InformeMensual.calcularTotales(modulo, idUnidad, anioNum, mesNum);

            const NOMBRES_MES = [
                'ENERO', 'FEBRERO', 'MARZO', 'ABRIL', 'MAYO', 'JUNIO',
                'JULIO', 'AGOSTO', 'SEPTIEMBRE', 'OCTUBRE', 'NOVIEMBRE', 'DICIEMBRE',
            ];

            const metadatos = {
                clues: unidad.CLUES,
                nombre_unidad: unidad.Nombre,
                mes_nombre: NOMBRES_MES[mesNum - 1],
                mes: mesNum,
                anio: anioNum,
                // El nombre del responsable viene del usuario guardado en
                // sessionStorage en el navegador (no hay sesión de usuario
                // en el servidor), así que llega ya armado desde el front.
                responsable: responsable || '',
            };

            const { ruta_archivo } = await generar_xls_informe_mensual(modulo, valores, metadatos);

            const nombreModulo = MODULOS[modulo].titulo.replace(/\s+/g, '_');
            const nombreDescarga = `Informe_Mensual_${nombreModulo}_${mesNum}_${anioNum}.xlsx`;

            res.download(ruta_archivo, nombreDescarga, (error) => {
                if (error) {
                    console.error('Error al enviar el informe mensual:', error);
                }
                // Limpieza del archivo temporal, igual que en bitácora.
                fs.unlink(ruta_archivo, () => {});
            });
        } catch (error) {
            console.error('Error al exportar informe mensual:', error);
            res.status(500).json({ mensaje: 'Ocurrió un error al generar el informe mensual.' });
        }
    }

    static async modulos(req, res) {
        try {
            const lista = Object.entries(MODULOS).map(([id, info]) => ({
                id,
                titulo: info.titulo,
            }));
            res.json(lista);
        } catch (error) {
            console.error('Error al listar módulos de informe mensual:', error);
            res.status(500).json({ mensaje: 'Ocurrió un error al listar los módulos.' });
        }
    }
}

module.exports = InformeMensualController;