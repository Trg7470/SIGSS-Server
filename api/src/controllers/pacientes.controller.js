const Pacientes = require('../models/pacientes.model');

// Columnas de Pacientes que se permite modificar desde el formulario de edición.
const COLUMNAS_PACIENTE = [
    'Nombre', 'Apellido_Paterno', 'Apellido_Materno', 'Fecha_Nacimiento',
    'Entidad_Nacimiento', 'Pais_Nacimiento', 'Curp', 'Sexo',
    'Es_Afromexicano', 'Es_Indigena', 'Es_Migrante', 'Expediente'
];

// Traduce un error de llave duplicada de MySQL a un mensaje entendible.
function mensaje_duplicado(error) {
    const llave = error.message.toLowerCase();

    if (llave.includes('curp')) {
        return 'Ya existe un paciente registrado con esa CURP.';
    }

    if (llave.includes('expediente')) {
        return 'Ya existe un paciente registrado con ese número de expediente.';
    }

    return 'Ya existe un paciente registrado con esos datos.';
}

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

    static async listar_pacientes(req, res) {
        const { busqueda = '', pagina = 1, limite = 10 } = req.query;

        const pagina_segura = Math.max(1, Number(pagina) || 1);
        const limite_seguro = Math.max(1, Number(limite) || 10);
        const offset = (pagina_segura - 1) * limite_seguro;

        try {
            const { filas, total } = await Pacientes.listar(busqueda.trim(), limite_seguro, offset);

            return res.status(200).json({
                success: true,
                pacientes: filas,
                total,
                pagina: pagina_segura,
                limite: limite_seguro
            });
        } catch (error) {
            console.error('Error al listar pacientes:', error);

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }

    static async consultar_paciente(req, res) {
        const { Id_Paciente } = req.params;

        try {
            const paciente = await Pacientes.consultar_por_id(Id_Paciente);

            if (!paciente) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró el paciente solicitado.'
                });
            }

            return res.status(200).json({
                success: true,
                paciente
            });
        } catch (error) {
            console.error('Error al consultar paciente:', error);

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }

    static async registrar_paciente(req, res) {
        const data = req.body;

        try {
            const resultado = await Pacientes.insertar(data);

            return res.status(201).json({
                success: true,
                Id_Paciente: resultado.Id_Paciente
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: mensaje_duplicado(error)
                });
            }

            console.error('Error al registrar paciente:', error);

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }

    static async actualizar_paciente(req, res) {
        const { Id_Paciente } = req.params;
        const data = req.body;

        try {
            const resultado = await Pacientes.actualizar(Id_Paciente, data, COLUMNAS_PACIENTE);

            if (!resultado.success) {
                return res.status(404).json({
                    success: false,
                    message: 'No se encontró el paciente, o no hubo cambios que guardar.'
                });
            }

            return res.status(200).json({
                success: true
            });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({
                    success: false,
                    message: mensaje_duplicado(error)
                });
            }

            console.error('Error al actualizar paciente:', error);

            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor.'
            });
        }
    }
}

module.exports = PacientesController;