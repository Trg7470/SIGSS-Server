const { mysqlPool } = require('../config/mysql');

class Prestadores {
    static async por_usuario(id_usuario) {
        const [rows] = await mysqlPool.query(
            `SELECT p.Id_Prestador, p.Nombre, p.Apellido_Paterno, p.Apellido_Materno, p.Curp, p.Cedula_Profesional,
tp.Nombre AS Tipo_Personal, u.Nombre AS Nombre_Unidad, u.CLUES, u.Id_Unidad, u.Area, u.Municipio
FROM Prestadores p
INNER JOIN Cat_Tipo_Personal AS tp ON tp.Id_Tipo_Personal = p.Cat_Tipo_Personal_Id_Tipo_Personal
INNER JOIN Unidades AS u ON u.Id_Unidad = p.Unidades_Id_Unidad
WHERE p.Usuarios_Id_Usuario = ?`,
            [id_usuario]
        );
        return rows[0];
    }
}

module.exports = Prestadores;