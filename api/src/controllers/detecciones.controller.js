const DeteccionesService = require('../services/modulos/detecciones.service');

class DeteccionesController {
    static async registrar(req, res) {
        try {
            const resultado = await DeteccionesService.registrar(req.body);
            res.status(201).json(resultado);
        } catch (error) {
            console.error('Error al registrar la consulta de detecciones:', error);
            res.status(500).json({ success: false, error: 'Error al registrar la consulta de detecciones.' });
        }
    }

    static async buscar_historial(req, res) {
        try {
            const resultado = await DeteccionesService.buscar_historial(req.query);
            res.status(200).json(resultado);
        } catch (error) {
            console.error('Error al buscar el historial de detecciones:', error);
            res.status(400).json({ success: false, error: error.message || 'Error al buscar el historial de detecciones.' });
        }
    }

    static async obtener_detalle(req, res) {
        try {
            const { id_consulta } = req.params;
            const detalle = await DeteccionesService.obtener_detalle(id_consulta);

            if (!detalle) {
                return res.status(404).json({ success: false, error: 'No se encontró la consulta.' });
            }

            res.status(200).json(detalle);
        } catch (error) {
            console.error('Error al obtener el detalle de detecciones:', error);
            res.status(500).json({ success: false, error: 'Error al obtener el detalle de detecciones.' });
        }
    }
}

module.exports = DeteccionesController;