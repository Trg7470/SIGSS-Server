const {mysqlPool} = require('../config/mysql');

class SaludReproductiva {
    static async registrar(data, connection = mysqlPool) 
    {
        const [result] = await connection.query(
            `INSERT INTO Salud_Reproductiva (Cat_Complicaciones_Id_Cat_Complicaciones, Cat_Riesgos_Id_Cat_Riesgos, 
            RT_Pregestacional, RT_Embarazo, Plan_Seguridad, Trimestre_Gestacional, Alto_Riesgo_Primera_Vez, 
            Otras_Acciones, RT_Puerperio, RT_Infeccion_Puerperial, Terapia_Hormonal) VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.Cat_Complicaciones_Id_Cat_Complicaciones, 
            data.Cat_Riesgos_Id_Cat_Riesgos, data.RT_Pregestacional, 
            data.RT_Embarazo, data.Plan_Seguridad, 
            data.Trimestre_Gestacional, data.Alto_Riesgo_Primera_Vez, 
            data.Otras_Acciones, data.RT_Puerperio, 
            data.RT_Infeccion_Puerperial, data.Terapia_Hormonal]
        );
        return {success: true, Id_Salud_Reproductiva: result.insertId};
    }
}
module.exports = SaludReproductiva;