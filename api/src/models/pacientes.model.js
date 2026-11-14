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
     static async actualizar(Id_Paciente, data, columnas, connection = mysqlPool) {
        const campos = Object.keys(data).filter(
            campo => columnas.includes(campo)
        );

        if (campos.length === 0) {
            return { success: true, affectedRows: 0 };
        }

        const asignaciones = campos
            .map(campo => `\`${campo}\` = COALESCE(?, \`${campo}\`)`)
            .join(', ');

        const valores = campos.map(campo => data[campo] ?? null);

        const [resultado] = await connection.query(
            `UPDATE Pacientes SET ${asignaciones} WHERE Id_Paciente = ?`,
            [...valores, Id_Paciente]
        );

        return { success: resultado.affectedRows > 0 };
    }
}

module.exports = Pacientes;