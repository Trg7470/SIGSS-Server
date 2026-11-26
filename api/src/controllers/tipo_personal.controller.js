const TipoPersonal = require('../models/tipo_personal.model');

class TipoPersonalController {
    static async listar(req, res) {
        try {
            const tipos_personal = await TipoPersonal.listar();
            res.json({ success: true, tipos_personal });
        } catch (error) {
            console.error('Error al obtener catálogo de tipo de personal:', error);
            res.status(500).json({ success: false, error: 'Error al obtener el catálogo de tipo de personal' });
        }
    }
}

module.exports = TipoPersonalController;