const ConsultaExternaService = require('../services/modulos/consulta_externa.service');

class ConsultaExternaController {
    static async registrar(req, res) {
        try {
            const data = req.body;
            const result = await ConsultaExternaService.registrar(data);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error al registrar la consulta externa:', error);
            res.status(500).json({ success: false, error: 'Error al registrar la consulta externa' });
        }
    }
}

module.exports = ConsultaExternaController;
