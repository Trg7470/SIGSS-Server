const {mysqlPool} = require('../config/mysql');

class Roles {
    static async listar() {
        const [rows] = await mysqlPool.query('SELECT * FROM Roles');
        return rows;
    }
}

module.exports = Roles;