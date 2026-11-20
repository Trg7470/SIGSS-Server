const SaludBucalService = require('../services/modulos/salud_bucal.service');

class SaludBucalController {
    static async registrar(req, res) {
        try {
            const data = req.body;
            const result = await SaludBucalService.registrar(data);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error al registrar la consulta de salud bucal:', error);
            res.status(500).json({ success: false, error: 'Error al registrar la consulta de salud bucal' });
        }
    }

    static async buscar_historial(req, res) {
        try {
            const { fecha_inicial, fecha_final, busqueda, pagina, limite } = req.query;
            const resultado = await SaludBucalService.buscar_historial({
                fecha_inicial,
                fecha_final,
                busqueda,
                pagina,
                limite,
            });
            res.status(200).json(resultado);
        } catch (error) {
            console.error('Error al buscar el historial de salud bucal:', error);
            res.status(500).json({ success: false, error: 'Error al buscar el historial de salud bucal' });
        }
    }

    static async obtener_detalle(req, res) {
        try {
            const { id_consulta } = req.params;
            const detalle = await SaludBucalService.obtener_detalle(id_consulta);
            if (!detalle) {
                return res.status(404).json({ success: false, error: 'No se encontró la consulta.' });
            }
            res.status(200).json(detalle);
        } catch (error) {
            console.error('Error al obtener el detalle de la consulta:', error);
            res.status(500).json({ success: false, error: 'Error al obtener el detalle de la consulta' });
        }
    }
}

module.exports = SaludBucalController;
