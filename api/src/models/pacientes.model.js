const { mysqlPool } = require('../config/mysql');

class Pacientes {
    static async buscar_paciente(criterios) {
        const [rows] = await mysqlPool.query(
            `SELECT Id_Paciente, Nombre, Apellido_Paterno, Apellido_Materno, Curp, Expediente
            FROM Pacientes
            WHERE (? IS NOT NULL AND Curp = ?)
            OR (? IS NOT NULL AND CONCAT_WS(' ', Nombre, Apellido_Paterno, Apellido_Materno) = ?)`,
            [
                criterios.Curp,
                criterios.Curp,
                criterios.Nombre_Completo,
                criterios.Nombre_Completo
            ]
        );

        return rows[0];
    }
}

module.exports = Pacientes;