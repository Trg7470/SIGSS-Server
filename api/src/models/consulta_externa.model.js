const {mysqlPool} = require('../config/mysql');

class ConsultaExterna {
    static async registrar(Id_Consulta, Id_Salud_Reproductiva, Id_Salud_Nino_Adolescente, Primera_Vez, Subsecuente, connection = mysqlPool) 
    {
        const [result] = await connection.query(
            `INSERT INTO Consulta_Externa (Salud_Reproductiva_Id_Salud_Reproductiva,
            Salud_Nino_Adolescente_Id_Salud_Nino_Adolescente, Consultas_Id_Consulta, Otros_Eventos_Primera_Vez, Otros_Eventos_Subsecuente) 
            VALUES (?, ?, ?, ?, ?)`,
            [Id_Salud_Reproductiva, 
            Id_Salud_Nino_Adolescente, 
            Id_Consulta, Primera_Vez, Subsecuente]
        );
        return {success: true, Id_Consulta_Externa: result.insertId};
    }
}

module.exports = ConsultaExterna;