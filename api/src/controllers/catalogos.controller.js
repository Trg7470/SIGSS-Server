const Catalogos = require('../models/catalogos.model');

class CatalogosController {
    static async buscar_diagnosticos(req, res) {
        const nombre = req.query.nombre?.trim();

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El parámetro nombre es obligatorio.'
            });
        }

        try {
            const diagnosticos = await Catalogos.diagnosticos_nombre(nombre);

            return res.status(200).json({
                success: true,
                diagnosticos
            });
        } catch (error) {
            console.error('Error al buscar diagnósticos:', error);

            return res.status(500).json({
                success: false,
                message: 'No fue posible buscar los diagnósticos.'
            });
        }
    }

    static async all(req, res) {
        try {
            const [
                complicaciones,
                derechohabiencia,
                discapacidades,
                espirometria_resultados,
                grupos_its,
                implante_subdermico,
                intervenciones_gerontologicas,
                medicina_tradicional,
                referido_motivo,
                referido_nivel,
                resultados_its,
                riesgos,
                servicios,
                teleconsulta_interpretacion,
                tipo_personal
            ] = await Promise.all([
                Catalogos.complicaciones(),
                Catalogos.derechohabiencia(),
                Catalogos.discapacidades(),
                Catalogos.espirometria_resultados(),
                Catalogos.grupos_its(),
                Catalogos.implante_subdermico(),
                Catalogos.intervenciones_gerontologicas(),
                Catalogos.medicina_tradicional(),
                Catalogos.referido_motivo(),
                Catalogos.referido_nivel(),
                Catalogos.resultados_its(),
                Catalogos.riesgos(),
                Catalogos.servicios(),
                Catalogos.teleconsulta_interpretacion(),
                Catalogos.tipo_personal()
            ]);

            return res.status(200).json({
                success: true,
                catalogos: {
                    complicaciones,
                    derechohabiencia,
                    discapacidades,
                    espirometria_resultados,
                    grupos_its,
                    implante_subdermico,
                    intervenciones_gerontologicas,
                    medicina_tradicional,
                    referido_motivo,
                    referido_nivel,
                    resultados_its,
                    riesgos,
                    servicios,
                    teleconsulta_interpretacion,
                    tipo_personal
                }
            });
        } catch (error) {
            console.error('Error al obtener los catálogos:', error);

            return res.status(500).json({
                success: false,
                message: 'No fue posible obtener los catálogos.'
            });
        }
    }
}

module.exports = CatalogosController;