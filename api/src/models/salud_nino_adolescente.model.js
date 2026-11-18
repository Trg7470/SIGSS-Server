const {mysqlPool} = require('../config/mysql');

class SaludNinoAdolescente {
    static async registrar(data, connection = mysqlPool) 
    {
        const [result] = await connection.query(
            `INSERT INTO Salud_Nino_Adolescente (RT_Nino_Sano, Tipo, Resultado, Resultado_Batelle, RT_EDA, 
            Plan_Tratamiento, Recuperado, Sobres_VSO, RT_IRA, Tipo_Tratamiento, RT_Neumonia, Aplicacion_Cedula_Cancer, 
            Madre_INF_PA) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.RT_Nino_Sano, data.Tipo, 
                data.Resultado, data.Resultado_Batelle, 
                data.RT_EDA, data.Plan_Tratamiento, 
                data.Recuperado, data.Sobres_VSO, 
                data.RT_IRA, data.Tipo_Tratamiento, 
                data.RT_Neumonia, data.Aplicacion_Cedula_Cancer, 
                data.Madre_INF_PA]
        );
        return {success: true, Id_Salud_Nino_Adolescente: result.insertId};
    }
}
module.exports = SaludNinoAdolescente;