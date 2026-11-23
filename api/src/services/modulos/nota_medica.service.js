const { mysqlPool } = require('../../config/mysql');
const NotasMedicas = require('../../models/notas_medicas.model');
const NotaMedicaTratamientos = require('../../models/nota_medica_tratamientos.model');
const Catalogos = require('../../models/catalogos.model');

class NotaMedicaService {
    /**
     * Fila completa de vista_nota_medica para una sola consulta: header,
     * paciente, signos vitales, diagnóstico, tratamiento (como texto) y lo
     * narrativo de Notas_Medicas. La usa el formulario de Nota Médica para
     * autorrellenarse, tanto al crearse (id_nota_medica = null) como al
     * reabrir una ya existente.
     *
     * @param {number|string} id_consulta
     * @returns {Promise<object|null>} La fila completa, o null si no existe la consulta.
     */
    static async obtener_detalle(id_consulta) {
        const [filas] = await mysqlPool.query(
            `SELECT *
             FROM vista_nota_medica
             WHERE id_consulta = ?
             LIMIT 1`,
            [id_consulta]
        );
        const nota = filas[0] || null;
        if (!nota) return null;

        // La vista solo trae tratamiento1/2/3 como texto concatenado (útil
        // para el documento final), pero el formulario necesita cada
        // medicamento por separado -- con su Id_Cat_Medicamento -- para
        // poder editarlo en el buscador. Si la nota ya existe, se agrega esa lista.
        nota.tratamientos = nota.id_nota_medica
            ? await NotaMedicaTratamientos.buscar_por_nota(nota.id_nota_medica)
            : [];

        return nota;
    }

    /**
     * Buscador para el autocompletado de medicamentos en el formulario de
     * Nota Médica (coincidencia parcial por nombre genérico o por clave).
     *
     * @param {string} texto
     * @returns {Promise<Array<object>>} Hasta 20 coincidencias.
     */
    static async buscar_medicamentos(texto) {
        return Catalogos.medicamentos(texto);
    }

    /**
     * Crea o actualiza la nota médica de una consulta (1:1 con Consultas) y
     * su tratamiento asociado (N medicamentos, vía Nota_Medica_Tratamientos).
     *
     * @param {number|string} id_consulta
     * @param {object} datos  Campos de Notas_Medicas: hora_consulta,
     *   motivo_consulta, padecimiento_actual, exploracion_fisica,
     *   resultado_estudios, pronostico, indicaciones_generales.
     * @param {Array<object>} tratamientos  [{ id_cat_medicamento, dosis,
     *   via_administracion, frecuencia, duracion, instrucciones_especificas }]
     * @returns {Promise<{ success: boolean, Id_Nota_Medica: number }>}
     */
    static async guardar(id_consulta, datos, tratamientos = []) {
        const connection = await mysqlPool.getConnection();

        try {
            await connection.beginTransaction();

            const datos_notas_medicas = {
                Hora_Consulta: datos.hora_consulta || null,
                Motivo_Consulta: datos.motivo_consulta || null,
                Padecimiento_Actual: datos.padecimiento_actual || null,
                Exploracion_Fisica: datos.exploracion_fisica || null,
                Resultado_Estudios: datos.resultado_estudios || null,
                Pronostico: datos.pronostico || null,
                Indicaciones_Generales: datos.indicaciones_generales || null,
            };

            const existente = await NotasMedicas.buscar_por_consulta(id_consulta, connection);
            let Id_Nota_Medica;

            if (existente) {
                Id_Nota_Medica = existente.Id_Nota_Medica;
                await NotasMedicas.actualizar(Id_Nota_Medica, datos_notas_medicas, connection);
                await NotaMedicaTratamientos.eliminar_por_nota(Id_Nota_Medica, connection);
            } else {
                const resultado = await NotasMedicas.registrar(id_consulta, datos_notas_medicas, connection);
                Id_Nota_Medica = resultado.Id_Nota_Medica;
            }

            for (const t of tratamientos) {
                await NotaMedicaTratamientos.registrar(
                    Id_Nota_Medica,
                    {
                        Cat_Medicamentos_Id_Cat_Medicamento: t.id_cat_medicamento,
                        Dosis: t.dosis || null,
                        Via_Administracion: t.via_administracion || null,
                        Frecuencia: t.frecuencia || null,
                        Duracion: t.duracion || null,
                        Instrucciones_Especificas: t.instrucciones_especificas || null,
                    },
                    connection
                );
            }

            await connection.commit();
            return { success: true, Id_Nota_Medica };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = NotaMedicaService;