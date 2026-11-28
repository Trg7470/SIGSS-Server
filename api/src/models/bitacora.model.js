
const { mysqlPool } = require('../config/mysql');

class Bitacora {
    static async registrar(Id_Usuario, Accion, Modulo, Tabla_Afectada, connection = mysqlPool, Id_Registro_Afectado = null) {
        const [rows] = await connection.query(
            `INSERT INTO Bitacora (Usuarios_Id_Usuario, Fecha_Hora, Accion, Modulo, Tabla_Afectada, Id_Registro_Afectado)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [Id_Usuario, new Date(), Accion, Modulo, Tabla_Afectada, Id_Registro_Afectado]
        );

        return { success: true, Id_Bitacora: rows.insertId };
    }

    static async consultar({ fecha_inicio, fecha_fin, id_usuario, modulo, busqueda, pagina = 1, por_pagina = 20 }) {
        const condiciones = ['DATE(Fecha_Hora) BETWEEN ? AND ?'];
        const valores = [fecha_inicio, fecha_fin];

        if (id_usuario) {
            condiciones.push('Id_Usuario = ?');
            valores.push(id_usuario);
        }
        if (modulo) {
            condiciones.push('Modulo = ?');
            valores.push(modulo);
        }
        if (busqueda) {
            condiciones.push('(Accion LIKE ? OR Tabla_Afectada LIKE ?)');
            valores.push(`%${busqueda}%`, `%${busqueda}%`);
        }

        const where = condiciones.join(' AND ');
        const offset = (pagina - 1) * por_pagina;

        const [rows] = await mysqlPool.query(
            `SELECT * FROM vista_bitacora WHERE ${where} ORDER BY Fecha_Hora DESC LIMIT ? OFFSET ?`,
            [...valores, por_pagina, offset]
        );
        const [[{ total }]] = await mysqlPool.query(
            `SELECT COUNT(*) AS total FROM vista_bitacora WHERE ${where}`,
            valores
        );

        return { rows, total };
    }
}

module.exports = Bitacora;
