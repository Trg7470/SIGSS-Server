const { mysqlPool } = require('../config/mysql');

class DeteccionesRevaloraciones {
    /**
     * Bloque "Detecciones y revaloraciones 60+" (geriatría/gerontología).
     * Es opcional: si no se capturó nada para este bloque, Consulta_Detecciones
     * se registra con Detecciones_Revaloraciones_Id_Detecciones_Revaloraciones = NULL.
     */
    static async registrar(data, connection = mysqlPool) {
        const [result] = await connection.query(
            `INSERT INTO Detecciones_Revaloraciones
                (Ha_Olvidado, Alteracion_Memoria, Demencia, Fuga_Orina,
                 Incontinencia_Urinaria, Tiene_Caidas, Sindrome_Caidas,
                 Estabilidad_Marcha, Estado_Nutricion, Actividades_Basicas,
                 Evaluacion_ABVD, Actividades_Instrumentales, Evaluacion_AIVD,
                 Grupo_Edad, Sexo, Resultado)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.Ha_Olvidado,
                data.Alteracion_Memoria,
                data.Demencia,
                data.Fuga_Orina,
                data.Incontinencia_Urinaria,
                data.Tiene_Caidas,
                data.Sindrome_Caidas,
                data.Estabilidad_Marcha,
                data.Estado_Nutricion,
                data.Actividades_Basicas,
                data.Evaluacion_ABVD,
                data.Actividades_Instrumentales,
                data.Evaluacion_AIVD,
                data.Grupo_Edad,
                data.Sexo,
                data.Resultado,
            ]
        );
        return { Id_Detecciones_Revaloraciones: result.insertId };
    }
}

module.exports = DeteccionesRevaloraciones;