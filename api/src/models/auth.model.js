const { mysqlPool } = require('../config/mysql');

class Auth {
    static async login(usuario) {
        try {
            const [rows] = await mysqlPool.query(
`SELECT U.Id_Usuario, U.Nombre, U.Apellido_Paterno, U.Apellido_Materno,
                U.Nombre_Usuario, U.Contrasena AS Password,
                R.Nombre AS Rol, U.Roles_Id_Rol AS Id_Rol, U.Activo,
                U.Roles_Id_Rol AS Id_Rol_Usuario,
                P.Id_Prestador, P.Curp, P.Cedula_Profesional,
                TP.Nombre AS Tipo_Personal,
                UN.Id_Unidad, UN.Nombre AS Nombre_Unidad, UN.CLUES AS Clues,
                UN.Area, UN.Municipio
                FROM Usuarios AS U
                INNER JOIN Roles AS R
                    ON U.Roles_Id_Rol = R.Id_Rol
                LEFT JOIN Prestadores AS P
                    ON P.Usuarios_Id_Usuario = U.Id_Usuario
                LEFT JOIN Cat_Tipo_Personal AS TP
                    ON TP.Id_Tipo_Personal = P.Cat_Tipo_Personal_Id_Tipo_Personal
                LEFT JOIN Unidades AS UN
                    ON UN.Id_Unidad = P.Unidades_Id_Unidad
                WHERE U.Nombre_Usuario = ?`,
                [usuario]
            );
            if (rows.length > 0) {
                return {
                    success: true,
                    user: rows[0]
                };
            } else {
                return { success: false };
            }
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Auth;