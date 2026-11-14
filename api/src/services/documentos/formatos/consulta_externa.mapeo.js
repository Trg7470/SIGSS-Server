'use strict';

/**
 * Mapeo de la vista `vista_consulta_externa` (MySQL) a las llaves que
 * espera `consulta_externa.config.js` para llenar la plantilla.
 *
 * Cada campo se resuelve de una de tres formas:
 *   - Simple:    { columna, catalogo? } -> toma fila[columna] y, si hay
 *                catálogo, lo traduce con resolver_catalogo() (Nombre por
 *                default).
 *   - Booleano:  { columna, booleano: true } -> 1/0 de MySQL -> "Si"/"No".
 *   - Calculado: { calcular(fila) } -> para campos que dependen de más de
 *                una columna, o que usan 'clave' en vez de 'nombre'.
 */

const { resolver_catalogo } = require('../../../utils/catalogos');

module.exports = {
    // --- Identificación (passthrough, la vista ya trae el valor final) ---
    servicio: { columna: 'servicio' },
    derechohabiencia: { columna: 'derechohabiencia' },
    folio_receta: { columna: 'folio_receta' },
    expediente: { columna: 'expediente' },
    curp: { columna: 'curp' },
    nombre: { columna: 'nombre' },

    // --- Edad (compuesto: Edad + Nombre de clave_edad) ---
    edad: {
        calcular: (fila) => {
            if (fila.edad === null || fila.edad === undefined) return undefined;
            const unidad = resolver_catalogo('clave_edad', fila.clave_edad_id);
            return `${fila.edad} ${unidad}`;
        },
    },

    // --- Sexo: Nombre completo ("MUJER") ---
    sexo: { columna: 'sexo_biologico_id', catalogo: 'sexo_biologico' },

    // --- Migrante: Nombre tal cual (NO/NACIONAL/INTERNACIONAL/RETORNADO) ---
    migrante: { columna: 'migrante_id', catalogo: 'migrante' },

    // --- Afromexicano / indígena: booleano -> "Si"/"No" ---
    afromexicano: { columna: 'afromexicano', booleano: true },
    indigena: { columna: 'indigena', booleano: true },

    // --- Mediciones ---
    peso: { columna: 'peso' },
    talla: { columna: 'talla' },
    cintura: { columna: 'cintura' },
    presion_diastolica: { columna: 'presion_diastolica' },
    presion_sistolica: { columna: 'presion_sistolica' },
    frecuencia_cardiaca: { columna: 'frecuencia_cardiaca' },
    frecuencia_respiratoria: { columna: 'frecuencia_respiratoria' },
    temperatura: { columna: 'temperatura' },
    saturacion_oxigeno: { columna: 'saturacion_oxigeno' },
    glucosa_ayuno: { columna: 'glucosa_ayuno', booleano: true },

    // --- Glucosa: Clave corta (1=LABORATORIO, 2=TIRA) ---
    glucosa_resultado: {
        calcular: (fila) => resolver_catalogo('instrumento_glucosa', fila.glucosa_resultado_id, 'clave'),
    },
    glucosa_tiras: { columna: 'glucosa_tiras' },
    probable_tb: { columna: 'probable_tb', booleano: true },

    // --- Contexto de la consulta ---
    primera_vez_uneme: { columna: 'primera_vez_uneme', booleano: true },
    primera_vez_anio: { columna: 'primera_vez_anio' },
    relacion_temporal_motivo: {
        calcular: (fila) => resolver_catalogo('rt', fila.relacion_temporal_motivo_id, 'clave'),
    },
    discapacidad_a: { columna: 'discapacidad_a' },
    discapacidad_b: { columna: 'discapacidad_b' },
    discapacidad_c: { columna: 'discapacidad_c' },

    // --- Diagnósticos ---
    diagnostico1: { columna: 'diagnostico1' },
    diagnostico2: { columna: 'diagnostico2' },
    diagnostico3: { columna: 'diagnostico3' },
    confirmacion_diagnostica: {
        calcular: (fila) => resolver_catalogo('confirmacion_diagnostica', fila.confirmacion_diagnostica_id, 'clave'),
    },
    diagnostico2_primera_vez: { columna: 'diagnostico2_primera_vez', booleano: true },
    diagnostico3_primera_vez: { columna: 'diagnostico3_primera_vez', booleano: true },

    // --- Salud mental y adicciones ---
    salud_mental_adicciones: {
        calcular: (fila) => resolver_catalogo(
            'intervenciones_salud_mental_adicciones',
            fila.salud_mental_adicciones_id,
            'clave'
        ),
    },

    // --- Salud reproductiva ---
    pregestacional_relacion_temporal: { columna: 'pregestacional_relacion_temporal_id', catalogo: 'rt' },
    pregestacional_riesgos: { columna: 'pregestacional_riesgos' },
    embarazo_relacion_temporal: { columna: 'embarazo_relacion_temporal_id', catalogo: 'rt' },
    embarazo_plan_seguridad: { columna: 'embarazo_plan_seguridad_id', catalogo: 'plan_seguridad' },
    embarazo_trimestre: { columna: 'embarazo_trimestre_id', catalogo: 'trimestre_gestacional' },
    embarazo_alto_riesgo_primera_vez: { columna: 'embarazo_alto_riesgo_primera_vez', booleano: true },
    embarazo_complicaciones: { columna: 'embarazo_complicaciones' },
    embarazo_otras_acciones: {
        calcular: (fila) => resolver_catalogo('otras_acciones_embarazadas', fila.embarazo_otras_acciones_id, 'clave'),
    },

    puerperio_relacion_temporal: { columna: 'puerperio_relacion_temporal_id', catalogo: 'rt' },
    puerperio_infeccion: { columna: 'puerperio_infeccion_id', catalogo: 'rt' },
    terapia_hormonal: { columna: 'terapia_hormonal', booleano: true },

    // --- Otros eventos ---
    otros_eventos_primera_vez: {
        calcular: (fila) => resolver_catalogo('otros_eventos', fila.otros_eventos_primera_vez_id, 'clave'),
    },
    otros_eventos_subsecuente: {
        calcular: (fila) => resolver_catalogo('otros_eventos', fila.otros_eventos_subsecuente_id, 'clave'),
    },


    // --- Salud del niño y del adolescente ---
    nino_sano: { columna: 'nino_sano_id', catalogo: 'rt' },
    edi_tipo: { columna: 'edi_tipo_id', catalogo: 'edi_tipo' },
    edi_resultado: {
        calcular: (fila) => resolver_catalogo('resultados_edi', fila.edi_resultado_id, 'clave'),
    },
    battelle_resultado: { columna: 'battelle_resultado_id', catalogo: 'resultado_batelle' },
    eda_relacion_temporal: { columna: 'eda_relacion_temporal_id', catalogo: 'rt' },
    eda_plan_tratamiento: { columna: 'eda_plan_tratamiento_id', catalogo: 'eda_plan_tratamiento' },
    eda_recuperado: { columna: 'eda_recuperado', booleano: true },
    eda_sobres_vso: { columna: 'eda_sobres_vso' },
    ira_relacion_temporal: { columna: 'ira_relacion_temporal_id', catalogo: 'rt' },
    ira_tipo_tratamiento: { columna: 'ira_tipo_tratamiento_id', catalogo: 'ira_tratamiento' },
    ira_neumonia: { columna: 'ira_neumonia_id', catalogo: 'rt' },
    cedula_cancer: { columna: 'cedula_cancer_id', catalogo: 'aplicacion_cedula_cancer_anio' },
    madre_prevencion_accidentes: { columna: 'madre_prevencion_accidentes', booleano: true },

    // --- Intervenciones gerontológicas y promoción de la salud ---
    intervenciones_gerontologicas: { columna: 'intervenciones_gerontologicas' }, // Debe mostrar clave
    consulta_integrada_linea_vida: { columna: 'consulta_integrada_linea_vida', booleano: true },
    presenta_cartilla: { columna: 'presenta_cartilla', booleano: true },
    esquema_vacunacion: { columna: 'esquema_vacunacion_id', catalogo: 'esquema_vacunacion' },
    albendazol_promocion: { columna: 'albendazol_promocion', booleano: true },
    sobres_vso_promocion: { columna: 'sobres_vso_promocion' },

    // --- Referencia, contrarreferencia y teleconsulta ---
    referido_por: { columna: 'referido_por' },
    referido_nivel: { columna: 'referido_nivel' },
    referido_especialidad: { columna: 'referido_especialidad' },
    contrarreferido: { columna: 'contrarreferido', booleano: true },
    teleconsulta_unidad: { columna: 'teleconsulta_unidad', booleano: true },
    teleconsulta_interpretacion_a: { columna: 'teleconsulta_interpretacion_a' },
    teleconsulta_interpretacion_b: { columna: 'teleconsulta_interpretacion_b' },
    teleconsulta_modalidad: { columna: 'teleconsulta_modalidad_id', catalogo: 'modalidad' },
    fecha_proxima_cita: {
        calcular: (fila) => {
            const fecha = fila.fecha_proxima_cita;
            if (!fecha) {
                return undefined;
            }
            if (fecha instanceof Date) {
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                return `${dia}/${mes}/${fecha.getFullYear()}`; // -> 26/11/2026
            }
            return String(fecha); // por si ya viene como texto
        },
    },
};