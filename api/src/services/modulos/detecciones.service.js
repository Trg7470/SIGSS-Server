const { mysqlPool } = require('../../config/mysql');
const Consultas = require('../../models/consultas.model');
const Mediciones = require('../../models/mediciones.model');
const ConsultaDiscapacidades = require('../../models/consulta_discapacidades.model');
const PromocionSalud = require('../../models/promocion_salud.model');
const Pacientes = require('../../models/pacientes.model');
const Bitacora = require('../../models/bitacora.model');
const Its = require('../../models/its.model');
const ConsumoSustanciasPsicoactivas = require('../../models/consumo_sustancias_psicoactivas.model');
const EnfermedadesCardiometabolicas = require('../../models/enfermedades_cardiometabolicas.model');
const DeteccionesRevaloraciones = require('../../models/detecciones_revaloraciones.model');
const ConsultaDetecciones = require('../../models/consulta_detecciones.model');
const Utils = require('../../utils/utils');

class DeteccionesService {
    static async registrar(data) {
        const connection = await mysqlPool.getConnection();

        try {
            let Id_ITS = null;
            let Id_Consumo_Sustancias_Psicoactivas = null;
            let Id_Enfermedades_Cardiometabolicas = null;
            let Id_Detecciones_Revaloraciones = null;

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

            // Los 4 sub-bloques (ITS, consumo de sustancias, enfermedades
            // cardiometabólicas, detecciones y revaloraciones 60+) son
            // opcionales: solo se insertan si el formulario trajo algo
            // capturado en ese bloque. En ITS, el formulario debe exigir los
            // 6 resultados y el grupo poblacional si se va a registrar el
            // bloque (son NOT NULL en la tabla).
            if (Utils.tiene_datos(data.its)) {
                const result_its = await Its.registrar(data.its, connection);
                Id_ITS = result_its.Id_ITS;
            }

            if (Utils.tiene_datos(data.consumo_sustancias_psicoactivas)) {
                const result_csp = await ConsumoSustanciasPsicoactivas.registrar(
                    data.consumo_sustancias_psicoactivas,
                    connection
                );
                Id_Consumo_Sustancias_Psicoactivas = result_csp.Id_Consumo_Sustancias_Psicoactivas;
            }

            if (Utils.tiene_datos(data.enfermedades_cardiometabolicas)) {
                const result_ecm = await EnfermedadesCardiometabolicas.registrar(
                    data.enfermedades_cardiometabolicas,
                    connection
                );
                Id_Enfermedades_Cardiometabolicas = result_ecm.Id_Enfermedades_Cardiometabolicas;
            }

            if (Utils.tiene_datos(data.detecciones_revaloraciones)) {
                const result_dr = await DeteccionesRevaloraciones.registrar(
                    data.detecciones_revaloraciones,
                    connection
                );
                Id_Detecciones_Revaloraciones = result_dr.Id_Detecciones_Revaloraciones;
            }

            if (Utils.tiene_datos(data.promocion_salud)) {
                await PromocionSalud.registrar({ ...data.promocion_salud, Id_Consulta }, connection);
            }

            await ConsultaDetecciones.registrar(
                Id_Consulta,
                {
                    Id_Cat_Espirometria_Resultados: data.detecciones?.Cat_Espirometria_Resultados_Id_Cat_Espirometria_Resultados,
                    Id_ITS,
                    Id_Consumo_Sustancias_Psicoactivas,
                    Id_Enfermedades_Cardiometabolicas,
                    Id_Detecciones_Revaloraciones,
                },
                data.detecciones || {},
                connection
            );

            await Bitacora.registrar(data.usuario.Id_Usuario, 'Registro de detecciones', 'Detecciones', 'Consulta_Detecciones', connection);

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
     * Historial de Detecciones: misma lógica que buscar_historial de los
     * otros módulos, reutilizando vista_detecciones (la misma que alimenta
     * la exportación a Excel/PDF).
     *
     * @param {object} filtros
     * @param {string} filtros.fecha_inicial - 'YYYY-MM-DD'.
     * @param {string} filtros.fecha_final   - 'YYYY-MM-DD'.
     * @param {string} [filtros.busqueda]    - Texto libre (nombre, CURP o folio).
     * @param {number} [filtros.pagina=1]
     * @param {number} [filtros.limite=10]
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
             FROM vista_detecciones
             WHERE fecha BETWEEN ? AND ?
             ${filtro_busqueda_sql}`,
            [fecha_inicial, fecha_final, ...parametros_busqueda]
        );
        const total = filas_total[0].total;

        const [registros] = await mysqlPool.query(
            `SELECT
                vd.id_consulta,
                vd.folio_receta,
                vd.expediente,
                vd.fecha,
                vd.nombre,
                vd.nombre_paciente,
                vd.apellido_paterno,
                vd.apellido_materno,
                vd.curp
             FROM vista_detecciones vd
             WHERE vd.fecha BETWEEN ? AND ?
             ${filtro_busqueda_sql}
             ORDER BY vd.fecha DESC, vd.id_consulta DESC
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
     * Fila completa de vista_detecciones para una sola consulta, para
     * llenar el modal "Ver detalles" del historial.
     *
     * @param {number|string} id_consulta
     * @returns {Promise<object|null>}
     */
    static async obtener_detalle(id_consulta) {
        const [filas] = await mysqlPool.query(
            `SELECT *
             FROM vista_detecciones
             WHERE id_consulta = ?
             LIMIT 1`,
            [id_consulta]
        );
        return filas[0] || null;
    }
}

module.exports = DeteccionesService;