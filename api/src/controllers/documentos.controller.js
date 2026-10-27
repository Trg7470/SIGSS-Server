const fs = require('fs/promises');
const { ExportarFormato } = require('../services/documentos/exportarFormato.service');

/**
 * Genera un documento Excel o PDF y lo entrega al navegador.
 * Limpia los archivos temporales después de la transferencia.
 */
async function ExportarDocumento(req, res) {
    let archivo;

    try {
        const { formato, tipoSalida } = req.body || {};

        if (
            typeof formato !== 'string' ||
            !formato.trim() ||
            typeof tipoSalida !== 'string' ||
            !tipoSalida.trim()
        ) {
            return res.status(400).json({
                mensaje: 'Debe indicar el formato y el tipo de salida.',
            });
        }

        // Generar el documento solicitado.
        archivo = await ExportarFormato(
            formato.trim(),
            tipoSalida.trim().toLowerCase()
        );

        if (
            typeof archivo.rutaArchivo !== 'string' ||
            typeof archivo.nombreArchivo !== 'string'
        ) {
            throw new Error(
                'El servicio no devolvió la información del archivo.'
            );
        }

        // Incluir todos los archivos temporales que deban eliminarse.
        const archivosTemporales = [
            ...new Set(
                Array.isArray(archivo.archivosTemporales)
                    ? archivo.archivosTemporales
                    : [archivo.rutaArchivo]
            ),
        ];

        // Enviar el archivo directamente al navegador.
        return res.download(
            archivo.rutaArchivo,
            archivo.nombreArchivo,
            async (error) => {
                // Eliminar los temporales tras finalizar la transferencia.
                const resultados = await Promise.allSettled(
                    archivosTemporales.map((ruta) => fs.unlink(ruta))
                );

                resultados.forEach((resultado) => {
                    if (
                        resultado.status === 'rejected' &&
                        resultado.reason.code !== 'ENOENT'
                    ) {
                        console.error(
                            '[Limpieza de archivos temporales]',
                            resultado.reason.message
                        );
                    }
                });

                if (error) {
                    console.error(
                        '[Descarga de documento]',
                        error.message
                    );

                    if (!res.headersSent) {
                        return res.status(500).json({
                            mensaje:
                                'No fue posible entregar el documento descargable.',
                        });
                    }

                    // La respuesta ya comenzó: no enviar un segundo JSON.
                    if (!res.destroyed) {
                        res.destroy(error);
                    }
                }
            }
        );
    } catch (error) {
        console.error(
            '[ExportarDocumento]',
            error.message
        );

        // Si la generación falla, limpiar los archivos que alcanzaron
        // a crearse y que el servicio haya registrado.
        if (archivo) {
            const archivosTemporales = [
                ...new Set(
                    Array.isArray(archivo.archivosTemporales)
                        ? archivo.archivosTemporales
                        : [archivo.rutaArchivo].filter(Boolean)
                ),
            ];

            await Promise.allSettled(
                archivosTemporales.map((ruta) => fs.unlink(ruta))
            );
        }

        if (res.headersSent) {
            return res.destroy();
        }

        return res.status(400).json({
            mensaje: error.message,
        });
    }
}

module.exports = { ExportarDocumento };
