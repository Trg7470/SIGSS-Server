const {mysqlPool} = require('../config/mysql');

class Bitacora
{
    static async registrar(Id_Usuario, Accion, Modulo, Tabla_Afectada)
    {
        try {
            const [rows] = await mysqlPool.query(
                `INSERT INTO Bitacora (Usuarios_Id_Usuario, Fecha_Hora, Accion, Modulo, Tabla_Afectada)
                VALUES (?, ?, ?, ?, ?)`,
                [Id_Usuario, new Date(), Accion, Modulo, Tabla_Afectada]
            );
            return { success: true};
        } catch (error) {
            console.error('Error al registrar en la bitácora:', error);
            return { success: false, error: 'Error al registrar en la bitácora' };
        }
    }
}

module.exports = Bitacora;