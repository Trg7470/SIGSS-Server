const {mysqlPool} = require('../config/mysql');

class Teleconsulta {
    static async registrar(data, connection = mysqlPool) 
    {
        const [result] = await connection.query(
            `INSERT INTO Teleconsultas (Consultas_Id_Consulta, Unidad_Consultante, 
            Modalidad, Cat_Teleconsulta_Interpretacion_Id_Teleconsulta, 
            Cat_Teleconsulta_Interpretacion_Id_Interpretacion_Diagnostica) VALUES 
            (?, ?, ?, ?, ?)`, 
            [data.Id_Consulta, data.Unidad_Consultante, 
            data.Modalidad, data.Cat_Teleconsulta_Interpretacion_Id_Teleconsulta, 
            data.Cat_Teleconsulta_Interpretacion_Id_Interpretacion_Diagnostica]
        );
        return {success: true, Id_Teleconsulta: result.insertId};
    }
}

module.exports = Teleconsulta;