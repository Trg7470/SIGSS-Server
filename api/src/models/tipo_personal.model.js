const { mysqlPool } = require('../config/mysql');

class TipoPersonal {
    static async listar() {
        const [rows] = await mysqlPool.query(
            `SELECT Id_Tipo_Personal, Nombre FROM Cat_Tipo_Personal ORDER BY Id_Tipo_Personal ASC`
        );
        return rows;
    }
}

module.exports = TipoPersonal;