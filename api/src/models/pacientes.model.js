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

    // Búsqueda por coincidencia parcial para la tabla del módulo de gestión de pacientes.
    // Búsqueda por coincidencia parcial, paginada igual que el historial de consultas.
    static async listar(filtro = '', limite = 10, offset = 0) {
        const termino = `%${filtro}%`;
        const condicion =
            `Nombre LIKE ? OR Apellido_Paterno LIKE ? OR Apellido_Materno LIKE ?
             OR Curp LIKE ? OR Expediente LIKE ?`;
        const parametros = [termino, termino, termino, termino, termino];

        const [filas_total] = await mysqlPool.query(
            `SELECT COUNT(*) AS total FROM Pacientes WHERE ${condicion}`,
            parametros
        );

        const [filas] = await mysqlPool.query(
            `SELECT Id_Paciente, Nombre, Apellido_Paterno, Apellido_Materno, Curp, Expediente
            FROM Pacientes
            WHERE ${condicion}
            ORDER BY Apellido_Paterno, Apellido_Materno, Nombre
            LIMIT ? OFFSET ?`,
            [...parametros, limite, offset]
        );

        return { filas, total: filas_total[0].total };
    }
    // Trae todos los campos del paciente, para precargar el formulario de edición/consulta.
    static async consultar_por_id(Id_Paciente) {
        const [rows] = await mysqlPool.query(
            `SELECT Id_Paciente, Nombre, Apellido_Paterno, Apellido_Materno, Fecha_Nacimiento,
                Entidad_Nacimiento, Pais_Nacimiento, Curp, Sexo, Es_Afromexicano, Es_Indigena,
                Es_Migrante, Expediente
            FROM Pacientes
            WHERE Id_Paciente = ?`,
            [Id_Paciente]
        );

        return rows[0];
    }

    // Alta de un paciente nuevo.
    static async insertar(data) {
        const [resultado] = await mysqlPool.query(
            `INSERT INTO Pacientes
                (Nombre, Apellido_Paterno, Apellido_Materno, Fecha_Nacimiento, Entidad_Nacimiento,
                 Pais_Nacimiento, Curp, Sexo, Es_Afromexicano, Es_Indigena, Es_Migrante, Expediente)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.Nombre,
                data.Apellido_Paterno,
                data.Apellido_Materno,
                data.Fecha_Nacimiento,
                data.Entidad_Nacimiento,
                data.Pais_Nacimiento ?? null,
                data.Curp,
                data.Sexo,
                data.Es_Afromexicano ?? null,
                data.Es_Indigena ?? null,
                data.Es_Migrante ?? null,
                data.Expediente
            ]
        );

        return { success: true, Id_Paciente: resultado.insertId };
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