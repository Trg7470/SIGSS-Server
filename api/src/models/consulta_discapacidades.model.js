const {mysqlPool} = require('../config/mysql');

class ConsultaDiscapacidades {
    static async registrar(data, connection = mysqlPool) 
    {
        const [result] = await connection.query(
            `INSERT INTO Consulta_Discapacidades (Cat_Discapacidades_Id_Discapacidad, Consultas_Id_Consulta) VALUES (?, ?)`,
            [data.discapacidades.Cat_Discapacidades_Id_Discapacidad, data.discapacidades.Consultas_Id_Consulta]);
        return {success: true, Id_Consulta_Discapacidades: result.insertId};
    }
}
module.exports = ConsultaDiscapacidades;