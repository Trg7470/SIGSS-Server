const { mysqlPool } = require('../../config/mysql');
const Consultas = require('../../models/consultas.model');
const Mediciones = require('../../models/mediciones.model');
const ConsultaDiscapacidades = require('../../models/consulta_discapacidades.model');
const ConsultaDiagnosticos = require('../../models/consulta_diagnosticos.model');
const AtencionPreventiva = require('../../models/atencion_preventiva.model');
const AtencionCurativa = require('../../models/atencion_curativa.model');
const SaludBucal = require('../../models/salud_bucal.model');
const PromocionSalud = require('../../models/promocion_salud.model');
const Teleconsulta = require('../../models/teleconsulta.model');
const Pacientes = require('../../models/pacientes.model');
const Bitacora = require('../../models/bitacora.model');
const Utils = require('../../utils/utils');

class SaludBucalService {
    static async registrar(data) {
        const connection = await mysqlPool.getConnection();

        try {
            let Id_Atencion_Preventiva = null;
            let Id_Atencion_Curativa = null;

            const columnas = [
                'Sexo',
                'Es_Afromexicano',
                'Es_Indigena',
                'Es_Migrante'];

            await connection.beginTransaction();

            if (Utils.tiene_datos(data.paciente)) {
                await Pacientes.actualizar(
                    data.consultas.Pacientes_Id_Paciente,
                    data.paciente,
                    columnas,
                    connection
                );
            }

            const result_c = await Consultas.registrar({ ...data.consultas }, connection);
            const Id_Consulta = result_c.Id_Consulta;

            await Mediciones.registrar({ ...data.mediciones, Id_Consulta }, connection);

            if (data.discapacidad) {
                const ids_discapacidad = [
                    data.discapacidad.discapacidad?.Cat_Discapacidades_Id_Discapacidad,
                    data.discapacidad.dificultad?.Cat_Discapacidades_Id_Discapacidad_B,
                    data.discapacidad.motivo?.Cat_Discapacidades_Id_Discapacidad_C
                ].filter(Boolean);

                for (const id of ids_discapacidad) {
                    await ConsultaDiscapacidades.registrar(
                        { Cat_Discapacidades_Id_Discapacidad: id, Id_Consulta },
                        connection
                    );
                }
            }

            if (data.diagnosticos && data.diagnosticos.length > 0) {
                const diagnosticos_validos = data.diagnosticos.filter(
                    d => d.Cat_Diagnosticos_Id_Cat_Diagnosticos
                );

                const diagnosticos_unicos = [
                    ...new Map(
                        diagnosticos_validos.map(d => [d.Cat_Diagnosticos_Id_Cat_Diagnosticos, d])
                    ).values()
                ];

                for (const diagnostico of diagnosticos_unicos) {
                    await ConsultaDiagnosticos.registrar({ ...diagnostico, Id_Consulta }, connection);
                }
            }

            if (Utils.tiene_datos(data.atencion_preventiva)) {
                const result_ap = await AtencionPreventiva.registrar(data.atencion_preventiva, connection);
                Id_Atencion_Preventiva = result_ap.Id_Atencion_Preventiva;
            }

            if (Utils.tiene_datos(data.atencion_curativa)) {
                const result_ac = await AtencionCurativa.registrar(data.atencion_curativa, connection);
                Id_Atencion_Curativa = result_ac.Id_Atencion_Curativa;
            }

            if (Utils.tiene_datos(data.promocion_salud)) {
                await PromocionSalud.registrar({ ...data.promocion_salud, Id_Consulta }, connection);
            }

            if (Utils.tiene_datos(data.teleconsulta)) {
                await Teleconsulta.registrar({ ...data.teleconsulta, Id_Consulta }, connection);
            }

            await SaludBucal.registrar(
                Id_Consulta,
                Id_Atencion_Preventiva,
                Id_Atencion_Curativa,
                data.salud_bucal,
                connection
            );

            await Bitacora.registrar(data.usuario.Id_Usuario, 'Registro de consulta de salud bucal', 'Salud Bucal', 'Consulta_Salud_Bucal', connection, Id_Consulta);

            await connection.commit();

            return { success: true, Id_Consulta };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Historial de consultas de salud bucal: reutiliza vista_salud_bucal (la
     * misma que alimentará la exportación a Excel/PDF del SINBA-SIS-02-P) en
     * vez de mantener una vista aparte solo para este listado. Pide nada más
     * las columnas que pinta la tabla; obtener_detalle() trae la fila
     * completa para el modal.
     *
     * Un día específico es un rango donde fecha_inicial === fecha_final; no
     * se trata como caso especial aquí.
     *
     * @param {object} filtros
     * @param {string} filtros.fecha_inicial - 'YYYY-MM-DD'.
     * @param {string} filtros.fecha_final   - 'YYYY-MM-DD'.
     * @param {string} [filtros.busqueda]    - Texto libre (nombre, CURP o folio).
     * @param {number} [filtros.pagina=1]
     * @param {number} [filtros.limite=10]
     * @returns {Promise<{registros: object[], total: number, pagina: number, limite: number}>}
     */
    static async buscar_historial(filtros) {
        const {
            fecha_inicial,
            fecha_final,
            busqueda = '',
            pagina = 1,
            limite = 10,
        } = filtros || {};

        if (!fecha_inicial || !fecha_final) {
            throw new Error('fecha_inicial y fecha_final son obligatorias.');
        }

        const texto_busqueda = String(busqueda).trim();
        const hay_busqueda = texto_busqueda.length > 0;
        const comodin = `%${texto_busqueda}%`;

        const filtro_busqueda_sql = hay_busqueda
            ? 'AND (nombre_paciente LIKE ? OR curp LIKE ? OR folio_receta LIKE ?)'
            : '';
        const parametros_busqueda = hay_busqueda ? [comodin, comodin, comodin] : [];

        const pagina_segura = Math.max(1, Number(pagina) || 1);
        const limite_seguro = Math.max(1, Number(limite) || 10);
        const offset = (pagina_segura - 1) * limite_seguro;

        const [filas_total] = await mysqlPool.query(
            `SELECT COUNT(*) AS total
             FROM vista_salud_bucal
             WHERE fecha BETWEEN ? AND ?
             ${filtro_busqueda_sql}`,
            [fecha_inicial, fecha_final, ...parametros_busqueda]
        );
        const total = filas_total[0].total;

        // id_nota_medica viene de un LEFT JOIN aparte (no de vista_salud_bucal,
        // que no sabe nada de Notas_Medicas): NULL si esta consulta todavía no
        // tiene una, para que el frontend sepa si mostrar el botón o no.
        const [registros] = await mysqlPool.query(
            `SELECT
                vsb.id_consulta,
                vsb.folio_receta,
                vsb.expediente,
                vsb.fecha,
                vsb.nombre,
                vsb.nombre_paciente,
                vsb.apellido_paterno,
                vsb.apellido_materno,
                vsb.curp,
                nm.Id_Nota_Medica AS id_nota_medica
             FROM vista_salud_bucal vsb
             LEFT JOIN Notas_Medicas nm ON nm.Consultas_Id_Consulta = vsb.id_consulta
             WHERE vsb.fecha BETWEEN ? AND ?
             ${filtro_busqueda_sql}
             ORDER BY vsb.fecha DESC, vsb.id_consulta DESC
             LIMIT ? OFFSET ?`,
            [fecha_inicial, fecha_final, ...parametros_busqueda, limite_seguro, offset]
        );

        return {
            registros,
            total,
            pagina: pagina_segura,
            limite: limite_seguro,
        };
    }

    /**
     * Fila completa de vista_salud_bucal para una sola consulta, para
     * llenar el modal "Ver detalles" del historial.
     *
     * @param {number|string} id_consulta
     * @returns {Promise<object|null>} La fila completa, o null si no existe.
     */
    static async obtener_detalle(id_consulta) {
        const [filas] = await mysqlPool.query(
            `SELECT *
             FROM vista_salud_bucal
             WHERE id_consulta = ?
             LIMIT 1`,
            [id_consulta]
        );
        return filas[0] || null;
    }
}

module.exports = SaludBucalService;