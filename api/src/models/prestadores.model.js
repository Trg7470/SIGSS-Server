const { mysqlPool } = require('../config/mysql');

class Prestadores {
    static async por_usuario(id_usuario, connection = mysqlPool) {
        const [rows] = await connection.query(
            `SELECT p.Id_Prestador, p.Nombre, p.Apellido_Paterno, p.Apellido_Materno, p.Curp, p.Cedula_Profesional,
            tp.Nombre AS Tipo_Personal, u.Nombre AS Nombre_Unidad, u.CLUES, u.Id_Unidad, u.Area, u.Municipio
            FROM Prestadores p
            LEFT JOIN Cat_Tipo_Personal AS tp ON tp.Id_Tipo_Personal = p.Cat_Tipo_Personal_Id_Tipo_Personal
            LEFT JOIN Unidades AS u ON u.Id_Unidad = p.Unidades_Id_Unidad
            WHERE p.Usuarios_Id_Usuario = ?`,
            [id_usuario]
        );
        return rows[0];
    }
    
    static async registrar(datos, connection = mysqlPool) {
        const {
            cat_tipo_personal_id_tipo_personal,
            unidades_id_unidad,
            curp,
            nombre,
            apellido_paterno,
            apellido_materno,
            cedula_profesional,
            usuarios_id_usuario
        } = datos;

        const [resultado] = await connection.query(
            `INSERT INTO Prestadores
                (Cat_Tipo_Personal_Id_Tipo_Personal, Unidades_Id_Unidad, Curp, Nombre, Apellido_Paterno, Apellido_Materno, Cedula_Profesional, Usuarios_Id_Usuario)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                cat_tipo_personal_id_tipo_personal || null,
                unidades_id_unidad,
                curp,
                nombre,
                apellido_paterno,
                apellido_materno,
                cedula_profesional || null,
                usuarios_id_usuario
            ]
        );

        return { success: true, id_prestador: resultado.insertId };
    }

    static async listar() {
    const [rows] = await mysqlPool.query(`
        SELECT
            p.Id_Prestador,
            p.Curp,
            CONCAT(p.Nombre, ' ', p.Apellido_Paterno, ' ', p.Apellido_Materno) AS nombre_completo,
            tp.Nombre AS tipo_personal
        FROM Prestadores p
        INNER JOIN Cat_Tipo_Personal tp ON tp.Id_Tipo_Personal = p.Cat_Tipo_Personal_Id_Tipo_Personal
        ORDER BY p.Nombre, p.Apellido_Paterno
    `);
    return rows;
}
}

module.exports = Prestadores;