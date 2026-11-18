const {mysqlPool} = require('../config/mysql');

class PlanificacionFamiliar {
    static async registrar(data, connection = mysqlPool)
    {
        const [result]  = await connection.query(
            `INSERT INTO Consulta_Planificacion_Familiar (Orientacion_Consejeria_Id_Orientacion_Consejeria, Consultas_Id_Consulta, 
            Puerpera_Aceptante, Oral, Inyectable_Mensual, Inyectable_Bimestral, Inyectable_Trimestral, Parche_Dermico, DIU, DIU_Medicado,
            Quirurgico, Preservativo, Preservativo_Femenino, Otro_Metodo, Anticoncepcion_Emergencia, Alta_Azoospermia) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.Orientacion_Consejeria_Id_Orientacion_Consejeria, data.Id_Consulta, data.Puerpera_Aceptante, 
                data.Metodo_Oral, data.Metodo_Inyectable_Mensual, data.Metodo_Inyectable_Bimestral, data.Metodo_Inyectable_Trimestral,
                data.Metodo_Parche_Dermico, data.Metodo_DIU, data.Metodo_DIU_Medicado, data.Metodo_Quirurgico,
                data.Metodo_Preservativo, data.Metodo_Preservativo_Femenino, data.Metodo_Otro, data.Anticoncepcion_Emergencia,
                data.Alta_Azoospermia
            ]
        );
        return {success: true, Id_Consulta_Planificacion_Familiar: result.insertId};
    } 
}

module.exports = PlanificacionFamiliar;