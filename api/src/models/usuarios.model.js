const { mysqlPool } = require('../config/mysql');

class Usuarios {
    static async listar(filtros = {}) {
        const {
            roles_id_rol,
            activo,
            busqueda,
            pagina = 1,
            por_pagina = 10
        } = filtros;

        const condiciones = [];
        const valores = [];

        if (roles_id_rol) {
            condiciones.push('Roles_Id_Rol = ?');
            valores.push(roles_id_rol);
        }

        if (activo === true || activo === false) {
            condiciones.push('Activo = ?');
            valores.push(activo);
        }

        if (busqueda) {
            condiciones.push(
                `(CONCAT(Nombre, ' ', Apellido_Paterno, ' ', Apellido_Materno) LIKE ?
                  OR Nombre_Usuario LIKE ?)`
            );
            valores.push(`%${busqueda}%`, `%${busqueda}%`);
        }

        const where = condiciones.length ? `WHERE ${condiciones.join(' AND ')}` : '';

        const [conteo] = await mysqlPool.query(
            `SELECT COUNT(*) AS total FROM Usuarios ${where}`,
            valores
        );
        const total = conteo[0].total;

        const limite = Number(por_pagina) || 10;
        const desplazamiento = (Number(pagina) > 0 ? Number(pagina) - 1 : 0) * limite;

        const [rows] = await mysqlPool.query(
            `SELECT Id_Usuario, Unidades_Id_Unidad, Roles_Id_Rol, Nombre, Apellido_Paterno,
                    Apellido_Materno, Nombre_Usuario, Activo, Ultimo_Acceso
             FROM Usuarios
             ${where}
             ORDER BY Id_Usuario ASC
             LIMIT ? OFFSET ?`,
            [...valores, limite, desplazamiento]
        );

        return { usuarios: rows, total };
    }

    static async obtener_por_id(id_usuario, connection = mysqlPool) {
        const [rows] = await connection.query(
            `SELECT Id_Usuario, Unidades_Id_Unidad, Roles_Id_Rol, Nombre, Apellido_Paterno,
                    Apellido_Materno, Nombre_Usuario, Activo, Ultimo_Acceso
             FROM Usuarios
             WHERE Id_Usuario = ?`,
            [id_usuario]
        );
        return rows[0] || null;
    }

    static async buscar_por_nombre_usuario(nombre_usuario, connection = mysqlPool) {
        const [rows] = await connection.query(
            `SELECT Id_Usuario, Nombre_Usuario, Contrasena, Activo FROM Usuarios WHERE Nombre_Usuario = ?`,
            [nombre_usuario]
        );
        return rows[0] || null;
    }

    static async crear(datos, connection = mysqlPool) {
        const {
            unidades_id_unidad, roles_id_rol, nombre,
            apellido_paterno, apellido_materno, nombre_usuario, contrasena
        } = datos;

        const [resultado] = await connection.query(
            `INSERT INTO Usuarios
                (Unidades_Id_Unidad, Roles_Id_Rol, Nombre, Apellido_Paterno, Apellido_Materno, Nombre_Usuario, Contrasena, Activo)
             VALUES (?, ?, ?, ?, ?, ?, ?, TRUE)`,
            [unidades_id_unidad, roles_id_rol, nombre, apellido_paterno, apellido_materno, nombre_usuario, contrasena]
        );

        return { success: true, id_usuario: resultado.insertId };
    }

    static async actualizar(id_usuario, datos, connection = mysqlPool) {
        const {
            unidades_id_unidad, roles_id_rol, nombre,
            apellido_paterno, apellido_materno, nombre_usuario
        } = datos;

        const [resultado] = await connection.query(
            `UPDATE Usuarios SET
                Unidades_Id_Unidad = ?, Roles_Id_Rol = ?, Nombre = ?,
                Apellido_Paterno = ?, Apellido_Materno = ?, Nombre_Usuario = ?
             WHERE Id_Usuario = ?`,
            [unidades_id_unidad, roles_id_rol, nombre, apellido_paterno, apellido_materno, nombre_usuario, id_usuario]
        );

        return { success: resultado.affectedRows > 0 };
    }

    static async cambiar_contrasena(id_usuario, contrasena_hash, connection = mysqlPool) {
        const [resultado] = await connection.query(
            `UPDATE Usuarios SET Contrasena = ? WHERE Id_Usuario = ?`,
            [contrasena_hash, id_usuario]
        );
        return { success: resultado.affectedRows > 0 };
    }

    static async cambiar_estado(id_usuario, activo, connection = mysqlPool) {
        const [resultado] = await connection.query(
            `UPDATE Usuarios SET Activo = ? WHERE Id_Usuario = ?`,
            [activo, id_usuario]
        );
        return { success: resultado.affectedRows > 0 };
    }

    static async registrar_acceso(id_usuario, connection = mysqlPool) {
        await connection.query(
            `UPDATE Usuarios SET Ultimo_Acceso = NOW() WHERE Id_Usuario = ?`,
            [id_usuario]
        );

        return { success: true };
    }
}

module.exports = Usuarios;