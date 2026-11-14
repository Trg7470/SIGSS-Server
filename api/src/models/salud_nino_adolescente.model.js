const {mysqlPool} = require('../config/mysql');

class SaludNinoAdolescente {
    static async registrar(data, connection = mysqlPool) 
    {
        const [result] = await connection.query(
            `INSERT INTO Salud_Nino_Adolescente (RT_Nino_Sano, Tipo, Resultado, Resultado_Batelle, RT_EDA, 
            Plan_Tratamiento, Recuperado, Sobres_VSO, RT_IRA, Tipo_Tratamiento, RT_Neumonia, Aplicacion_Cedula_Cancer, 
            Madre_INF_PA) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.salud_nino_adolescente.RT_Nino_Sano, data.salud_nino_adolescente.Tipo, 
                data.salud_nino_adolescente.Resultado, data.salud_nino_adolescente.Resultado_Batelle, 
                data.salud_nino_adolescente.RT_EDA, data.salud_nino_adolescente.Plan_Tratamiento, 
                data.salud_nino_adolescente.Recuperado, data.salud_nino_adolescente.Sobres_VSO, 
                data.salud_nino_adolescente.RT_IRA, data.salud_nino_adolescente.Tipo_Tratamiento, 
                data.salud_nino_adolescente.RT_Neumonia, data.salud_nino_adolescente.Aplicacion_Cedula_Cancer, 
                data.salud_nino_adolescente.Madre_INF_PA]
        );
        return {success: true, Id_Salud_Nino_Adolescente: result.insertId};
    }
}
module.exports = SaludNinoAdolescente;