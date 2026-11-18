const { mysqlPool } = require('../../config/mysql');
const Consultas = require('../../models/consultas.model');
const Mediciones = require('../../models/mediciones.model');
const ConsultaDiscapacidades = require('../../models/consulta_discapacidades.model');
const ConsultaDiagnosticos = require('../../models/consulta_diagnosticos.model');
const SaludReproductiva = require('../../models/salud_reproductiva.model');
const SaludNinoAdolescente = require('../../models/salud_nino_adolescente.model');
const PromocionSalud = require('../../models/promocion_salud.model');
const Teleconsulta = require('../../models/teleconsulta.model');
const ConsultaExterna = require('../../models/consulta_externa.model');
const Pacientes = require('../../models/pacientes.model');
const Bitacora = require('../../models/bitacora.model');
const Utils = require('../../utils/utils');

class ConsultaExternaService {
    static async registrar(data) {
        const connection = await mysqlPool.getConnection();

        try {
            let Id_Salud_Reproductiva = null;
            let Id_Salud_Nino_Adolescente = null;

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
            const result_c = await Consultas.registrar({ ...data.consultas}, connection);
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

            if (Utils.tiene_datos(data.salud_reproductiva)) {
                const result_sr = await SaludReproductiva.registrar(data.salud_reproductiva, connection);
                Id_Salud_Reproductiva = result_sr.Id_Salud_Reproductiva;
            }

            if (Utils.tiene_datos(data.salud_nino_adolescente)) {
                const result_sna = await SaludNinoAdolescente.registrar(data.salud_nino_adolescente, connection);
                Id_Salud_Nino_Adolescente = result_sna.Id_Salud_Nino_Adolescente;
            }
            if (Utils.tiene_datos(data.promocion_salud)) {
                await PromocionSalud.registrar({ ...data.promocion_salud, Id_Consulta }, connection);
            }

            if (Utils.tiene_datos(data.teleconsulta)) {
                await Teleconsulta.registrar({ ...data.teleconsulta, Id_Consulta }, connection);
            }

            await ConsultaExterna.registrar(
                Id_Consulta,
                Id_Salud_Reproductiva,
                Id_Salud_Nino_Adolescente,
                data.consultas.Primera_Vez,
                data.consultas.Subsecuente,
                connection
            );

            await Bitacora.registrar(data.usuario.Id_Usuario, 'Registro de consulta externa', 'Consulta Externa', 'Consulta_Externa', connection);

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
     * Historial de consultas externas: reutiliza vista_consulta_externa (la
     * misma que alimenta la exportación a Excel/PDF) en vez de mantener una
     * vista aparte solo para este listado. Pide nada más las columnas que
     * pinta la tabla; obtener_detalle() trae la fila completa para el modal.
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

        // Total de registros que cumplen el filtro, para la paginación.
        const [filas_total] = await mysqlPool.query(
            `SELECT COUNT(*) AS total
             FROM vista_consulta_externa
             WHERE fecha BETWEEN ? AND ?
             ${filtro_busqueda_sql}`,
            [fecha_inicial, fecha_final, ...parametros_busqueda]
        );
        const total = filas_total[0].total;

        // Página de resultados, solo con las columnas que pinta la tabla.
        const [registros] = await mysqlPool.query(
            `SELECT
                id_consulta,
                folio_receta,
                expediente,
                fecha,
                nombre,
                nombre_paciente,
                apellido_paterno,
                apellido_materno,
                curp
             FROM vista_consulta_externa
             WHERE fecha BETWEEN ? AND ?
             ${filtro_busqueda_sql}
             ORDER BY fecha DESC, id_consulta DESC
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
     * Fila completa de vista_consulta_externa para una sola consulta, para
     * llenar el modal "Ver detalles" del historial.
     *
     * @param {number|string} id_consulta
     * @returns {Promise<object|null>} La fila completa, o null si no existe.
     */
    static async obtener_detalle(id_consulta) {
        const [filas] = await mysqlPool.query(
            `SELECT *
             FROM vista_consulta_externa
             WHERE id_consulta = ?
             LIMIT 1`,
            [id_consulta]
        );
        return filas[0] || null;
    }
}

module.exports = ConsultaExternaService;