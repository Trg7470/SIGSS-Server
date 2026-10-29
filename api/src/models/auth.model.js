const { mysqlPool } = require('../config/mysql');

class Auth {
    static async login(usuario) {
        try {
            const [rows] = await mysqlPool.query(
                `SELECT U.Id_Usuario, U.Nombre, U.Apellido_Paterno, U.Apellido_Materno, 
                U.Nombre_Usuario, U.Contrasena AS Password,
                R.Nombre AS Rol, U.Roles_Id_Rol AS Id_Rol, U.Activo,
                U.Roles_Id_Rol AS Id_Rol_Usuario
                FROM Usuarios AS U
                INNER JOIN Roles AS R
                ON U.Roles_Id_Rol = R.Id_Rol
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