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
}

module.exports = ConsultaExternaService;