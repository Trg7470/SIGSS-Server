const fs = require('fs/promises');
const { exportar_formato } = require('../services/documentos/exportar_formato.service');
const { consultar_formato } = require('../services/documentos/consultar_formato.service');

async function exportar_documento(req, res) {
    let archivo;

    try {
        const { formato, tipo_salida, id_consulta, fecha, clues, nombre_archivo } = req.query || {};

        if (
            typeof formato !== 'string' ||
            !formato.trim() ||
            typeof tipo_salida !== 'string' ||
            !tipo_salida.trim()
        ) {
            return res.status(400).json({
                mensaje: 'Debe indicar el formato y el tipo de salida.',
            });
        }

        const datos = await consultar_formato(formato.trim(), {
            id_consulta,
            fecha,
            clues,
        });

        archivo = await exportar_formato(
            formato.trim(),
            tipo_salida.trim().toLowerCase(),
            datos,
            nombre_archivo
        );

        if (
            typeof archivo.ruta_archivo !== 'string' ||
            typeof archivo.nombre_descarga !== 'string'
        ) {
            throw new Error(
                'El servicio no devolvió la información del archivo.'
            );
        }

        const archivosTemporales = [
            ...new Set(
                Array.isArray(archivo.archivos_temporales)
                    ? archivo.archivos_temporales
                    : [archivo.ruta_archivo]
            ),
        ];

        return res.download(
            archivo.ruta_archivo,
            archivo.nombre_descarga,
            async (error) => {
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

        if (archivo) {
            const archivosTemporales = [
                ...new Set(
                    Array.isArray(archivo.archivos_temporales)
                        ? archivo.archivos_temporales
                        : [archivo.ruta_archivo].filter(Boolean)
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

module.exports = { exportar_documento };