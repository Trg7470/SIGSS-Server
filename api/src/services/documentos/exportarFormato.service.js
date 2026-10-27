const fs = require('fs/promises');
const { GenerarXls } = require('./generarXls.service');
const { GenerarPdf } = require('./generarPdf.service');


/**
 * Genera un formato Excel o PDF y administra sus archivos temporales.
 *
 * Si se solicita PDF, primero genera un Excel intermedio.
 * Si la conversión a PDF falla, elimina ese Excel para evitar
 * dejar archivos temporales abandonados.
 *
 * @param {string} idFormato - Formato clínico solicitado.
 * @param {string} tipoSalida - xlsx o pdf.
 * @returns {Promise<object>} Información del archivo generado.
 */
async function ExportarFormato(idFormato, tipoSalida) {
    const tipo = String(tipoSalida || '').trim().toLowerCase();
    if (!['xlsx', 'pdf'].includes(tipo)) {
        throw new Error('El tipo de salida debe ser xlsx o pdf.');
    }
    // Generar el Excel a partir de la plantilla.
    const archivoExcel = await GenerarXls(idFormato);
    // Verificar que el servicio haya devuelto una ruta válida.
    if (
        !archivoExcel ||
        typeof archivoExcel.rutaArchivo !== 'string' ||
        !archivoExcel.rutaArchivo.trim()
    ) {
        throw new Error('El servicio de Excel no devolvió una ruta de archivo válida.' );
    }
    // Si se solicita Excel, no se requiere conversión.
    if (tipo === 'xlsx') {
        return {
            ...archivoExcel,
            tipoSalida: 'xlsx',
            archivosTemporales: [
                archivoExcel.rutaArchivo,
            ],
        };
    }
    // Si se solicita PDF, convertir el Excel generado.
    try {
        const archivoPDF = await GenerarPdf(archivoExcel.rutaArchivo);
        if (
            !archivoPDF ||
            typeof archivoPDF.rutaArchivo !== 'string' ||
            !archivoPDF.rutaArchivo.trim()
        ) {
            throw new Error('El servicio de PDF no devolvió una ruta de archivo válida.');
        }

        // Ambos archivos deberán eliminarse después de la descarga.
        return {
            ...archivoPDF,
            formato: idFormato,
            tipoSalida: 'pdf',
            archivosTemporales: [
                archivoPDF.rutaArchivo,
                archivoExcel.rutaArchivo,
            ],
        };

    } catch (error) {
        // La conversión falló: limpiar el Excel.
        try {
            await fs.unlink(archivoExcel.rutaArchivo);
        } catch (errorLimpieza) {
            // Ignorar únicamente si el archivo ya no existe.
            if (errorLimpieza.code !== 'ENOENT') {
                console.error('[Limpieza de Excel temporal]',errorLimpieza.message);
            }
        }
        throw error;
    }
}

module.exports = { ExportarFormato };
