const {mysqlPool} = require('../config/mysql');

class ConsultasDiagnosticos {
    static async registrar(data, connection = mysqlPool) 
    {
        const [result] = await connection.query(
            `INSERT INTO Consulta_Diagnosticos (Consultas_Id_Consulta, Cat_Diagnosticos_Id_Cat_Diagnosticos, Confirmacion_Diagnostica, Primera_Vez, Cat_Medicina_
            Tradicional_Id_Cat_Medicina_Tradicional) 
            VALUES (?, ?, ?, ?, ?)`,
            [data.Id_Consulta, 
            data.Cat_Diagnosticos_Id_Cat_Diagnosticos, 
            data.Confirmacion_Diagnostica,
            data.Primera_Vez,
            data.Cat_Medicina_Tradicional_Id_Cat_Medicina_Tradicional]);
        return {success: true, Id_Consulta_Diagnostico: result.insertId};
    }
}
module.exports = ConsultasDiagnosticos;