const { mysqlPool } = require('../config/mysql');

class NotaMedicaTratamientos {
    static async registrar(Id_Nota_Medica, data, connection = mysqlPool) {
        const [result] = await connection.query(
            `INSERT INTO Nota_Medica_Tratamientos
                (Notas_Medicas_Id_Nota_Medica, Cat_Medicamentos_Id_Cat_Medicamento,
                 Dosis, Via_Administracion, Frecuencia, Duracion, Instrucciones_Especificas)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                Id_Nota_Medica,
                data.Cat_Medicamentos_Id_Cat_Medicamento,
                data.Dosis, data.Via_Administracion, data.Frecuencia,
                data.Duracion, data.Instrucciones_Especificas,
            ]
        );
        return { success: true, Id_Nota_Medica_Tratamiento: result.insertId };
    }

    static async eliminar_por_nota(Id_Nota_Medica, connection = mysqlPool) {
        await connection.query(
            `DELETE FROM Nota_Medica_Tratamientos WHERE Notas_Medicas_Id_Nota_Medica = ?`,
            [Id_Nota_Medica]
        );
    }

    static async buscar_por_nota(Id_Nota_Medica, connection = mysqlPool) {
        const [filas] = await connection.query(
            `SELECT
                nmt.Cat_Medicamentos_Id_Cat_Medicamento AS id_cat_medicamento,
                med.Nombre_Generico                     AS nombre_generico,
                med.Forma_Farmaceutica                   AS forma_farmaceutica,
                med.Presentacion_Envase                  AS presentacion_envase,
                nmt.Dosis                                AS dosis,
                nmt.Via_Administracion                   AS via_administracion,
                nmt.Frecuencia                           AS frecuencia,
                nmt.Duracion                             AS duracion,
                nmt.Instrucciones_Especificas             AS instrucciones_especificas
             FROM Nota_Medica_Tratamientos nmt
             JOIN Cat_Medicamentos med ON med.Id_Cat_Medicamento = nmt.Cat_Medicamentos_Id_Cat_Medicamento
             WHERE nmt.Notas_Medicas_Id_Nota_Medica = ?
             ORDER BY med.Nombre_Generico`,
            [Id_Nota_Medica]
        );
        return filas;
    }
}

module.exports = NotaMedicaTratamientos;