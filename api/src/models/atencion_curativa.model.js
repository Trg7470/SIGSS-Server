const {mysqlPool} = require('../config/mysql');

class AtencionCurativa {
    static async registrar(data, connection = mysqlPool)
    {
        const [result] = await connection.query(
            `INSERT INTO Atencion_Curativa (Amalgama, Resinas, Ionomero_Vidrio, Alcasite, Material_Temporal,
            Diente_Temporal, Diente_Permanente, Terapia_Pulpar, Cirugia_Bucal, Farmacoterapia, Otras_Atenciones)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.Amalgama, data.Resinas, data.Ionomero_Vidrio, data.Alcasite, data.Material_Temporal,
            data.Diente_Temporal, data.Diente_Permanente, data.Terapia_Pulpar, data.Cirugia_Bucal,
            data.Farmacoterapia, data.Otras_Atenciones]
        );
        return {success: true, Id_Atencion_Curativa: result.insertId};
    }
}

module.exports = AtencionCurativa;
