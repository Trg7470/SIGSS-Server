const Bitacora = require('../models/bitacora.model');
const { mysqlPool } = require('../config/mysql');
const { generar_xls_bitacora } = require('../services/documentos/generar_xls_bitacora.service');
const { generar_pdf } = require('../services/documentos/generar_pdf.service');

class BitacoraController {
    static async exportar(req, res) {
        try {
            const { fecha_inicio, fecha_fin, id_usuario, modulo, busqueda, tipo_salida } = req.query;

            if (!fecha_inicio || !fecha_fin) {
                return res.status(400).json({ success: false, error: 'Fecha inicial y final son requeridas' });
            }

            const { rows } = await Bitacora.consultar({ fecha_inicio, fecha_fin, id_usuario, modulo, busqueda, pagina: 1, por_pagina: 10000 });

            const metadatos = {
                fecha_inicio,
                fecha_fin,
                usuario_filtro: id_usuario ? rows[0]?.Usuario : null,
                modulo_filtro: modulo || null,
                generado_por: `${req.usuario.Usuario}`,
            };

            const archivo_excel = await generar_xls_bitacora(rows, metadatos);

            if (tipo_salida === 'pdf') {
                const archivo_pdf = await generar_pdf(archivo_excel.ruta_archivo);
                return res.download(archivo_pdf.ruta_archivo, `Reporte_Bitacora_${new Date().toISOString().split('T')[0]}.pdf`);
            }

            return res.download(archivo_excel.ruta_archivo, `Reporte_Bitacora_${new Date().toISOString().split('T')[0]}.xlsx`);
        } catch (error) {
            console.error('Error al exportar bitácora:', error);
            res.status(500).json({ success: false, error: 'Error al exportar la bitácora' });
        }
    }
    static async registrar(req, res) {
        let connection;
        try {
            const { Id_Usuario, Accion, Modulo, Tabla_Afectada } = req.body;

            if (!Id_Usuario || !Accion || !Modulo) {
                return res.status(400).json({
                    success: false,
                    error: 'Faltan datos requeridos (Id_Usuario, Accion, Modulo)'
                });
            }

            connection = await mysqlPool.getConnection();
            await connection.beginTransaction();

            const result = await Bitacora.registrar(Id_Usuario, Accion, Modulo, Tabla_Afectada, connection);

            await connection.commit();
            res.status(201).json(result);
        } catch (error) {
            if (connection) await connection.rollback();
            console.error('Error al registrar en la bitácora:', error);
            res.status(500).json({ success: false, error: 'Error al registrar en la bitácora' });
        } finally {
            if (connection) connection.release();
        }
    }
    static async consultar(req, res) {
        try {
            const { fecha_inicio, fecha_fin, id_usuario, modulo, busqueda, pagina } = req.query;

            if (!fecha_inicio || !fecha_fin) {
                return res.status(400).json({ success: false, error: 'Fecha inicial y final son requeridas' });
            }

            const { rows, total } = await Bitacora.consultar({
                fecha_inicio, fecha_fin, id_usuario, modulo, busqueda,
                pagina: Number(pagina) || 1
            });

            res.json({ success: true, data: rows, total });
        } catch (error) {
            console.error('Error al consultar la bitácora:', error);
            res.status(500).json({ success: false, error: 'Error al consultar la bitácora' });
        }
    }
}

module.exports = BitacoraController;