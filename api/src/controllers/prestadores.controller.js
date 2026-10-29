const Prestadores = require('../models/prestadores.model');

class PrestadoresController {
    static async por_usuario(req, res) {
        const id_usuario = req.params.id_usuario;
        try {
            const result = await Prestadores.por_usuario(id_usuario);
            res.json(result);
        } catch (error) {
            res.status(500).json(
                {
                    mensaje: "Error al obtener prestadores por usuario",
                    error: error.message
                }
            )
        }
    }
}

module.exports = PrestadoresController;