const {mysqlPool} = require('../config/mysql');

class OrientacionConsejeria {
    static async registrar(data, connection = mysqlPool) {
        const [result] = await connection.query(
            `INSERT INTO Orientacion_Consejeria (Planificacion_Familiar, Prevencion_ITS, Prevencion_Embarazo, Otras_Atenciones_SSRA) 
            VALUES (?, ?, ?, ?)`,
            [data.Planificacion_Familiar, data.Prevencion_ITS, data.Prevencion_Embarazo, data.Otras_Atenciones_SSRA]
        );
        return {success: true, Id_Orientacion_Consejeria: result.insertId};
    }
}

module.exports = OrientacionConsejeria;