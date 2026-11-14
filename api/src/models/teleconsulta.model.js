const {mysqlPool} = require('../config/mysql');

class Teleconsulta {
    static async registrar(data, connection = mysqlPool) 
    {
        const [result] = await connection.query(
            `Insert INTO Telconsultas (Consultas_Id_Consulta, Unidad_Consultante, 
            Modalidad, Cat_Teleconsulta_Interpretacion_Id_Teleconsulta, 
            Cat_Teleconsulta_Interpretacion_Id_Interpretacion_Diagnostica) VALUES 
            (?, ?, ?, ?, ?)`, 
            [data.Teleconsulta.Consultas_Id_Consulta, data.Teleconsulta.Unidad_Consultante, 
            data.Teleconsulta.Modalidad, data.Teleconsulta.Cat_Teleconsulta_Interpretacion_Id_Teleconsulta, 
            data.Teleconsulta.Cat_Teleconsulta_Interpretacion_Id_Interpretacion_Diagnostica]
        );
        return {success: true, Id_Teleconsulta: result.insertId};
    }
}

module.exports = Teleconsulta;