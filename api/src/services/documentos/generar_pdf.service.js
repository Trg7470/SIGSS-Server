'use strict';

const fs = require('fs/promises');
const os = require('os');
const path = require('path');
const { pathToFileURL } = require('url');
const { randomUUID } = require('crypto');
const { execFile } = require('child_process');
const { promisify } = require('util');
const RUTAS = require('../../config/rutas');
const ejecutar_archivo = promisify(execFile);


/**
 * Convierte un archivo XLSX a PDF.
 *
 * Valida el archivo de entrada y elimina el PDF incompleto
 * si la conversión o la validación del resultado fallan.
 *
 * @param {string} ruta_excel - Ruta del archivo XLSX de origen.
 * @returns {Promise<object>} Información del PDF generado.
 */
async function generar_pdf(ruta_excel) {
    let ruta_pdf;
    let conversion_iniciada = false;
    let perfil_libre_office;
    try {
        // Validar la ruta recibida.
        if (
            typeof ruta_excel !== 'string' ||
            !ruta_excel.trim()
        ) {
            throw new Error('Debe proporcionar una ruta de Excel válida.');
        }
        // Resolver las rutas reales del archivo y del directorio autorizado.
        const ruta_real_excel = await fs.realpath(ruta_excel);
        const ruta_real_temporales = await fs.realpath(RUTAS.temporales_excel);
        const ruta_relativa = path.relative(ruta_real_temporales, ruta_real_excel);

        // Aceptar únicamente archivos dentro de la carpeta temporal XLSX.
        if (
            ruta_relativa === '..' ||
            ruta_relativa.startsWith(`..${path.sep}`) ||
            path.isAbsolute(ruta_relativa)
        ) {
            throw new Error('El archivo Excel está fuera del directorio autorizado.');
        }

        // Verificar la extensión y el tipo del archivo.
        if (
            path.extname(ruta_real_excel).toLowerCase() !== '.xlsx'
        ) {
            throw new Error('El archivo de entrada debe ser XLSX.');
        }

        const informacion_excel = await fs.stat(ruta_real_excel);

        if (!informacion_excel.isFile()) {
            throw new Error('El archivo Excel no es válido.');
        }
        // Preparar la carpeta de salida.
        await fs.mkdir(
            RUTAS.temporales_pdf,
            { recursive: true }
        );

        // Determinar el nombre esperado del PDF.
        const nombre_archivo =
            `${path.basename(
                ruta_real_excel,
                path.extname(ruta_real_excel)
            )}.pdf`;

        ruta_pdf = path.join(
            RUTAS.temporales_pdf,
            nombre_archivo
        );

        // Ejecutar LibreOffice para convertir el documento.
        conversion_iniciada = true;

        // Cada conversión usa su propio perfil de LibreOffice. Con el perfil
        // compartido, dos conversiones simultáneas se estorban y una falla
        // sin generar el PDF.
        perfil_libre_office = path.join(os.tmpdir(), `lo-perfil-${randomUUID()}`);

        await ejecutar_archivo(
            RUTAS.libre_office,
            [
                `-env:UserInstallation=${pathToFileURL(perfil_libre_office).href}`,
                '--headless',
                '--convert-to',
                'pdf:calc_pdf_Export',
                '--outdir',
                RUTAS.temporales_pdf,
                ruta_real_excel,
            ],
            {
                windowsHide: true,
                timeout: 60000,
            }
        );

        // Confirmar que el PDF se haya generado correctamente.
        const informacion_pdf = await fs.stat(ruta_pdf);

        if (
            !informacion_pdf.isFile() ||
            informacion_pdf.size === 0
        ) {
            throw new Error(
                'El PDF no se generó correctamente o está vacío.'
            );
        }

        return {
            mensaje: 'PDF generado correctamente.',
            nombre_archivo,
            ruta_archivo: ruta_pdf,
        };

    } catch (error) {
        // Si la conversión falló, intentar limpiar el PDF resultante.
        if (conversion_iniciada && ruta_pdf) {
            try {
                await fs.unlink(ruta_pdf);
            } catch (error_limpieza) {
                // El archivo puede no existir si LibreOffice falló
                // antes de generar el resultado.
                if (error_limpieza.code !== 'ENOENT') {
                    console.error(
                        '[Limpieza de PDF temporal]',
                        error_limpieza.message
                    );
                }
            }
        }

        console.error(
            '[generar_pdf]',
            error.message
        );

        throw new Error(
            `No fue posible generar el PDF: ${error.message}`
        );
    } finally {
        // Eliminar el perfil temporal de LibreOffice.
        if (perfil_libre_office) {
            await fs.rm(perfil_libre_office, { recursive: true, force: true })
                .catch(() => {});
        }
    }
}

module.exports = { generar_pdf };