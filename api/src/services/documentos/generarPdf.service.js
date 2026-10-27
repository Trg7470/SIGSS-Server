const fs = require('fs/promises');
const path = require('path');
const { execFile } = require('child_process');
const { promisify } = require('util');
const RUTAS = require('../../config/rutas');
const EjecutarArchivo = promisify(execFile);


/**
 * Convierte un archivo XLSX a PDF.
 *
 * Valida el archivo de entrada y elimina el PDF incompleto
 * si la conversión o la validación del resultado fallan.
 *
 * @param {string} rutaExcel - Ruta del archivo XLSX de origen.
 * @returns {Promise<object>} Información del PDF generado.
 */
async function GenerarPdf(rutaExcel) {
    let rutaPDF;
    let conversionIniciada = false;
    try {
        // Validar la ruta recibida.
        if (
            typeof rutaExcel !== 'string' ||
            !rutaExcel.trim()
        ) {
            throw new Error('Debe proporcionar una ruta de Excel válida.');
        }
        // Resolver las rutas reales del archivo y del directorio autorizado.
        const rutaRealExcel = await fs.realpath(rutaExcel);
        const rutaRealTemporales = await fs.realpath(RUTAS.temporalesExcel);
        const rutaRelativa = path.relative(rutaRealTemporales, rutaRealExcel);

        // Aceptar únicamente archivos dentro de la carpeta temporal XLSX.
        if (
            rutaRelativa === '..' ||
            rutaRelativa.startsWith(`..${path.sep}`) ||
            path.isAbsolute(rutaRelativa)
        ) {
            throw new Error('El archivo Excel está fuera del directorio autorizado.');
        }

        // Verificar la extensión y el tipo del archivo.
        if (
            path.extname(rutaRealExcel).toLowerCase() !== '.xlsx'
        ) {
            throw new Error('El archivo de entrada debe ser XLSX.');
        }

        const informacionExcel = await fs.stat(rutaRealExcel);

        if (!informacionExcel.isFile()) {
            throw new Error('El archivo Excel no es válido.');
        }
        // Preparar la carpeta de salida.
        await fs.mkdir(
            RUTAS.temporalesPDF,
            { recursive: true }
        );

        // 5. Determinar el nombre esperado del PDF.
        const nombreArchivo =
            `${path.basename(
                rutaRealExcel,
                path.extname(rutaRealExcel)
            )}.pdf`;

        rutaPDF = path.join(
            RUTAS.temporalesPDF,
            nombreArchivo
        );

        // 6. Ejecutar LibreOffice para convertir el documento.
        conversionIniciada = true;

        await EjecutarArchivo(
            RUTAS.libreOffice,
            [
                '--headless',
                '--convert-to',
                'pdf:calc_pdf_Export',
                '--outdir',
                RUTAS.temporalesPDF,
                rutaRealExcel,
            ],
            {
                windowsHide: true,
                timeout: 60000,
            }
        );

        // 7. Confirmar que el PDF se haya generado correctamente.
        const informacionPDF = await fs.stat(rutaPDF);

        if (
            !informacionPDF.isFile() ||
            informacionPDF.size === 0
        ) {
            throw new Error(
                'El PDF no se generó correctamente o está vacío.'
            );
        }

        return {
            mensaje: 'PDF generado correctamente.',
            nombreArchivo,
            rutaArchivo: rutaPDF,
        };

    } catch (error) {
        // 8. Si la conversión falló, intentar limpiar el PDF resultante.
        if (conversionIniciada && rutaPDF) {
            try {
                await fs.unlink(rutaPDF);
            } catch (errorLimpieza) {
                // El archivo puede no existir si LibreOffice falló
                // antes de generar el resultado.
                if (errorLimpieza.code !== 'ENOENT') {
                    console.error(
                        '[Limpieza de PDF temporal]',
                        errorLimpieza.message
                    );
                }
            }
        }

        console.error(
            '[GenerarPdf]',
            error.message
        );

        throw new Error(
            `No fue posible generar el PDF: ${error.message}`
        );
    }
}

module.exports = { GenerarPdf };
