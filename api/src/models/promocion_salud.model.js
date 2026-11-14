const {mysqlPool} = require('../config/mysql');

class PromocionSalud
{
    static async registrar(data, connection = mysqlPool)
    {
        const [result] = await connection.query(
            `INSERT INTO Promocion_Salud (Consultas_Id_Consulta, Consulta_Integrada_Linea_Vida, Presenta_Cartilla, 
            Esquema_Vacunacion, Promocion_Albendazol, Sobres_VSO) VALUES (?, ?, ?, ?, ?, ?)`,
            [data.Id_Consulta, data.Consulta_Integrada_Linea_Vida, 
            data.Presenta_Cartilla, data.Esquema_Vacunacion, 
            data.Promocion_Albendazol, data.Sobres_VSO]
        );
        return {success: true, Id_Promocion_Salud: result.insertId};
    }
}
module.exports = PromocionSalud;