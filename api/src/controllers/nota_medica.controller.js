const NotaMedicaService = require('../services/modulos/nota_medica.service');

class NotaMedicaController {
    static async obtener_detalle(req, res) {
        try {
            const { id_consulta } = req.params;
            const detalle = await NotaMedicaService.obtener_detalle(id_consulta);
            if (!detalle) {
                return res.status(404).json({ success: false, error: 'No se encontró la consulta.' });
            }
            res.status(200).json(detalle);
        } catch (error) {
            console.error('Error al obtener el detalle de la nota médica:', error);
            res.status(500).json({ success: false, error: 'Error al obtener el detalle de la nota médica' });
        }
    }

    static async buscar_medicamentos(req, res) {
        try {
            const texto = (req.query.q || '').trim();
            if (texto.length < 2) {
                return res.status(200).json([]);
            }
            const resultados = await NotaMedicaService.buscar_medicamentos(texto);
            res.status(200).json(resultados);
        } catch (error) {
            console.error('Error al buscar medicamentos:', error);
            res.status(500).json({ success: false, error: 'Error al buscar medicamentos' });
        }
    }

    static async guardar(req, res) {
        try {
            const { id_consulta } = req.params;
            const { tratamientos, ...datos } = req.body;
            const resultado = await NotaMedicaService.guardar(id_consulta, datos, tratamientos || []);
            res.status(200).json(resultado);
        } catch (error) {
            console.error('Error al guardar la nota médica:', error);
            res.status(500).json({ success: false, error: 'Error al guardar la nota médica' });
        }
    }
}

module.exports = NotaMedicaController;