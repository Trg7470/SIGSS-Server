const {mysqlPool} = require('../config/mysql');

class ConsultaPlanificacionImplante {
    static async registrar(data, connection = mysqlPool)
    {
        const [result]  = await connection.query(
            `INSERT INTO Consulta_Planificacion_Implante (Consulta_P_F_Id_Consulta_Planificacion_Familiar,
            Cat_Implante_Subdermico_Id_Cat_Implante_Subdermico) 
            VALUES (?, ?)`,
            [
                data.Id_Consulta_Planificacion_Familiar, data.Id_Cat_Implante_Subdermico
            ]
        );
        return {success: true, Id_Consulta_Planificacion_Implante: result.insertId};
    }
}

module.exports = ConsultaPlanificacionImplante;