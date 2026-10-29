
const Pacientes = require('../models/pacientes.model');

class PacientesController {
    static async buscar_paciente(req, res) {
        const { criterios } = req.body;

        try {
            const result = await Pacientes.buscar_paciente(criterios);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró ningún paciente con esos datos.'
                });
            }

            return res.status(200).json({
                success: true,
                paciente: result
            });
        } catch (error) {
            console.error('Error al buscar paciente:', error);

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
}

module.exports = PacientesController;
