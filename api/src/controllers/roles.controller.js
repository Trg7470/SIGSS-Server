const Roles = require('../models/roles.model');

class RolesController {
    static async listar(req, res) {
        try {
            const roles = await Roles.listar();
            res.status(200).json({ success: true, roles });
        } catch (error) {
            console.error('Error al listar roles:', error);
            res.status(500).json({ success: false, error: 'Error al listar roles' });
        }
    }
}

module.exports = RolesController;