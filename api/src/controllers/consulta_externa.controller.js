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

    static async buscar_historial(req, res) {
        try {
            const { fecha_inicial, fecha_final, busqueda, pagina, limite } = req.query;
            const resultado = await ConsultaExternaService.buscar_historial({
                fecha_inicial,
                fecha_final,
                busqueda,
                pagina,
                limite,
            });
            res.status(200).json(resultado);
        } catch (error) {
            console.error('Error al buscar el historial de consultas externas:', error);
            res.status(500).json({ success: false, error: 'Error al buscar el historial de consultas externas' });
        }
    }

    static async obtener_detalle(req, res) {
        try {
            const { id_consulta } = req.params;
            const detalle = await ConsultaExternaService.obtener_detalle(id_consulta);
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

module.exports = ConsultaExternaController;