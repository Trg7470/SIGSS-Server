const {mysqlPool} = require('../config/mysql');

class SaludBucal {
    static async registrar(Id_Consulta, Id_Atencion_Preventiva, Id_Atencion_Curativa, data, connection = mysqlPool)
    {
        const [result] = await connection.query(
            `INSERT INTO Consulta_Salud_Bucal (Consultas_Id_Consulta, Atencion_Curativa_Id_Atencion_Curativa,
            Atencion_Preventiva_Id_Atencion_Preventiva, Radiografias, Tratamiento_Integral_Terminado,
            Orientacion_Salud) VALUES (?, ?, ?, ?, ?, ?)`,
            [Id_Consulta, Id_Atencion_Curativa, Id_Atencion_Preventiva,
            data.Radiografias, data.Tratamiento_Integral_Terminado, data.Orientacion_Salud]
        );
        return {success: true, Id_Consulta_Salud_Bucal: result.insertId};
    }
}

module.exports = SaludBucal;
