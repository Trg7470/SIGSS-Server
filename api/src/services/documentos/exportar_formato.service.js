'use strict';

const fs = require('fs/promises');
const { generar_xls } = require('./generar_xls.service');
const { generar_pdf } = require('./generar_pdf.service');


/**
 * Genera un formato Excel o PDF y administra sus archivos temporales.
 *
 * Si se solicita PDF, primero genera un Excel intermedio.
 * Si la conversión a PDF falla, elimina ese Excel para evitar
 * dejar archivos temporales abandonados.
 *
 * @param {string} id_formato - Formato clínico solicitado (ej. 'consulta-externa').
 * @param {string} tipo_salida - xlsx o pdf.
 * @param {object} datos - Encabezado y registros que se plasmarán en el formato.
 * @returns {Promise<object>} Información del archivo generado.
 */
async function exportar_formato(id_formato, tipo_salida, datos) {
    const tipo = String(tipo_salida || '').trim().toLowerCase();
    if (!['xlsx', 'pdf'].includes(tipo)) {
        throw new Error('El tipo de salida debe ser xlsx o pdf.');
    }
    // Generar el Excel a partir de la plantilla.
    const archivo_excel = await generar_xls(id_formato, datos);
    // Verificar que el servicio haya devuelto una ruta válida.
    if (
        !archivo_excel ||
        typeof archivo_excel.ruta_archivo !== 'string' ||
        !archivo_excel.ruta_archivo.trim()
    ) {
        throw new Error('El servicio de Excel no devolvió una ruta de archivo válida.' );
    }
    // Si se solicita Excel, no se requiere conversión.
    if (tipo === 'xlsx') {
        return {
            ...archivo_excel,
            tipo_salida: 'xlsx',
            archivos_temporales: [
                archivo_excel.ruta_archivo,
            ],
        };
    }
    // Si se solicita PDF, convertir el Excel generado.
    try {
        const archivo_pdf = await generar_pdf(archivo_excel.ruta_archivo);
        if (
            !archivo_pdf ||
            typeof archivo_pdf.ruta_archivo !== 'string' ||
            !archivo_pdf.ruta_archivo.trim()
        ) {
            throw new Error('El servicio de PDF no devolvió una ruta de archivo válida.');
        }

        // Ambos archivos deberán eliminarse después de la descarga.
        return {
            ...archivo_pdf,
            formato: archivo_excel.formato,
            consultas: archivo_excel.consultas,
            hojas: archivo_excel.hojas,
            tipo_salida: 'pdf',
            archivos_temporales: [
                archivo_pdf.ruta_archivo,
                archivo_excel.ruta_archivo,
            ],
        };

    } catch (error) {
        // La conversión falló: limpiar el Excel.
        try {
            await fs.unlink(archivo_excel.ruta_archivo);
        } catch (error_limpieza) {
            // Ignorar únicamente si el archivo ya no existe.
            if (error_limpieza.code !== 'ENOENT') {
                console.error('[Limpieza de Excel temporal]', error_limpieza.message);
            }
        }
        throw error;
    }
}

module.exports = { exportar_formato };