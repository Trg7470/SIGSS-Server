const {mysqlPool} = require('../config/mysql');

class Consultas {
    static async registrar(data, connection = mysqlPool) 
    {
        const [result] = await connection.query(
            `INSERT INTO Consultas (Cat_I_G_Id_Cat_Intervenciones_Gerontologicas, Cat_Servicio_Id_Cat_Especialidad, 
            Cat_Referido_Nivel_Id_Cat_Referido_Nivel, Cat_Referido_Motivo_Id_Cat_Referido_Motivo, 
            Cat_Derechohabiencia_Id_Cat_Derechohabiencia, Prestadores_Id_Prestador, Unidades_Id_Unidad,
            Pacientes_Id_Paciente, Cat_Servicio_Id_Cat_Servicio, Edad, Clave_Edad, Folio_Receta, Primera_Vez_Uneme,
            Primera_Vez_Anio_Cobertura, Contrarreferido, Intervencion_Salud_Mental_Adicciones, RT_Por_Motivo, Fecha_Proxima_Cita,
            Fecha_Consulta) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.Cat_I_G_Id_Cat_Intervenciones_Gerontologicas, data.Cat_Servicio_Id_Cat_Especialidad,
            data.Cat_Referido_Nivel_Id_Cat_Referido_Nivel, data.Cat_Referido_Motivo_Id_Cat_Referido_Motivo,
            data.Cat_Derechohabiencia_Id_Cat_Derechohabiencia, data.Prestadores_Id_Prestador, 
            data.Unidades_Id_Unidad, data.Pacientes_Id_Paciente, 
            data.Cat_Servicio_Id_Cat_Servicio, data.Edad, data.Clave_Edad,
            data.Folio_Receta, data.Primera_Vez_Uneme, data.Primera_Vez_Anio_Cobertura, 
            data.Contrarreferido,data.Intervencion_Salud_Mental_Adicciones,data.RT_Por_Motivo, data.Fecha_Proxima_Cita,
            data.Fecha_Consulta]
        );
        return {success: true, Id_Consulta: result.insertId};
    }
}

module.exports = Consultas;