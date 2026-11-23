const { mysqlPool } = require('../../config/mysql');
const Consultas = require('../../models/consultas.model');
const Mediciones = require('../../models/mediciones.model');
const ConsultaDiscapacidades = require('../../models/consulta_discapacidades.model');
const ConsultaDiagnosticos = require('../../models/consulta_diagnosticos.model');
const OrientacionConsejeria = require('../../models/orientacion_consejeria.model');
const PromocionSalud = require('../../models/promocion_salud.model');
const Teleconsulta = require('../../models/teleconsulta.model');
const PlanificacionFamiliar = require('../../models/consulta_planificacion_familiar.model');
const ConsultaPlanificacionImplante = require('../../models/consulta_planificacion_implante.model');
const Pacientes = require('../../models/pacientes.model');
const Bitacora = require('../../models/bitacora.model');
const Utils = require('../../utils/utils');

class PlanificacionFamiliarService {
    static async registrar(data) {
        const connection = await mysqlPool.getConnection();
        try {
            let Orientacion_Consejeria_Id_Orientacion_Consejeria = null;

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

            if (Utils.tiene_datos(data.orientacion_consejeria)) {
                const result_oc = await OrientacionConsejeria.registrar(data.orientacion_consejeria, connection);
                Orientacion_Consejeria_Id_Orientacion_Consejeria = result_oc.Id_Orientacion_Consejeria;
            }

            if (Utils.tiene_datos(data.promocion_salud)) {
                await PromocionSalud.registrar({ ...data.promocion_salud, Id_Consulta }, connection);
            }

            if (Utils.tiene_datos(data.teleconsulta)) {
                await Teleconsulta.registrar({ ...data.teleconsulta, Id_Consulta }, connection);
            }

            // Implante subdérmico: inciso a) una varilla, inciso b) doble
            // varilla. Se separan de las columnas propias de
            // Consulta_Planificacion_Familiar porque van en la tabla puente
            // Consulta_Planificacion_Implante, no en esa fila.
            const {
                Cat_Implante_Subdermico_Id_Cat_Implante_Subdermico_A,
                Cat_Implante_Subdermico_Id_Cat_Implante_Subdermico_B,
                ...datos_planificacion_familiar
            } = data.planificacion_familiar || {};

            const result_pf = await PlanificacionFamiliar.registrar(
                { ...datos_planificacion_familiar, Id_Consulta, Orientacion_Consejeria_Id_Orientacion_Consejeria },
                connection
            );
            const Id_Consulta_Planificacion_Familiar = result_pf.Id_Consulta_Planificacion_Familiar;

            const ids_implante = [
                Cat_Implante_Subdermico_Id_Cat_Implante_Subdermico_A,
                Cat_Implante_Subdermico_Id_Cat_Implante_Subdermico_B
            ].filter(Boolean);

            for (const id of ids_implante) {
                await ConsultaPlanificacionImplante.registrar(
                    {
                        Id_Consulta_Planificacion_Familiar: Id_Consulta_Planificacion_Familiar,
                        Id_Cat_Implante_Subdermico: id
                    },
                    connection
                );
            }

            await Bitacora.registrar(data.usuario.Id_Usuario, 'Registro de consulta en planificación familiar', 'Planificacion_Familiar', 'Consulta_Planificacion_Familiar', connection);

            await connection.commit();

            return { success: true, Id_Consulta};
        }
        catch (error) {
            await connection.rollback();
            throw error;
        }
        finally {
            connection.release();
        }
    }


    /**
     * Historial de consultas de planificación familiar: reutiliza
     * vista_planificacion_familiar (la misma que alimenta la exportación a
     * Excel/PDF) en vez de mantener una vista aparte solo para este listado.
     * Pide nada más las columnas que pinta la tabla; obtener_detalle() trae
     * la fila completa para el modal.
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
             FROM vista_planificacion_familiar
             WHERE fecha BETWEEN ? AND ?
             ${filtro_busqueda_sql}`,
            [fecha_inicial, fecha_final, ...parametros_busqueda]
        );
        const total = filas_total[0].total;

        // Página de resultados, solo con las columnas que pinta la tabla.
        // id_nota_medica viene de un LEFT JOIN aparte (no de
        // vista_planificacion_familiar, que no sabe nada de Notas_Medicas):
        // NULL si esta consulta todavía no tiene una, para que el frontend
        // sepa si mostrar el botón o no.
        const [registros] = await mysqlPool.query(
            `SELECT
                vpf.id_consulta,
                vpf.folio_receta,
                vpf.expediente,
                vpf.fecha,
                vpf.nombre,
                vpf.nombre_paciente,
                vpf.apellido_paterno,
                vpf.apellido_materno,
                vpf.curp,
                nm.Id_Nota_Medica AS id_nota_medica
             FROM vista_planificacion_familiar vpf
             LEFT JOIN Notas_Medicas nm ON nm.Consultas_Id_Consulta = vpf.id_consulta
             WHERE vpf.fecha BETWEEN ? AND ?
             ${filtro_busqueda_sql}
             ORDER BY vpf.fecha DESC, vpf.id_consulta DESC
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
     * Fila completa de vista_planificacion_familiar para una sola consulta, para
     * llenar el modal "Ver detalles" del historial.
     *
     * @param {number|string} id_consulta
     * @returns {Promise<object|null>} La fila completa, o null si no existe.
     */
    static async obtener_detalle(id_consulta) {
        const [filas] = await mysqlPool.query(
            `SELECT *
             FROM vista_planificacion_familiar
             WHERE id_consulta = ? LIMIT 1`,
            [id_consulta]
        );
        return filas[0] || null;
    }
}

module.exports = PlanificacionFamiliarService;