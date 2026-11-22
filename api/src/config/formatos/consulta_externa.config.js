'use strict';

/**
 * Configuración del formato SINBA-SIS-01-P 2026
 * "Hoja diaria de consulta externa".
 *
 * Cada hoja de Excel tiene 5 bloques de captura (uno por consulta). Cada
 * bloque ocupa 4 filas a partir de la fila 14. En la configuración de campos:
 *
 *   col    -> columna de la plantilla.
 *   fila   -> desplazamiento dentro del bloque (0 a 3). La celda real es
 *             fila_inicial + (consulta * altura_bloque) + fila.
 *   desborda -> true si el texto debe extenderse sobre celdas vecinas vacías
 *             (celdas no combinadas).
 *   titulo -> true si la celda ya trae una etiqueta impresa (Peso, Talla, a, b,
 *             25, 26...) que debe conservarse junto al valor.
 *   centrado -> true para centrar horizontalmente el valor (celdas sueltas
 *             debajo de su etiqueta: peso, talla, FC, FR...).
 *
 * IMPORTANTE: las llaves de "registros.campos" son el contrato con el
 * frontend (consulta_externa.js). Si cambias un nombre aquí, debes cambiarlo
 * también donde se arma el objeto "registro" antes de enviarlo.
 *
 * Para crear otro formato se copia este archivo y se ajustan estas tablas:
 * el generador no cambia..
 */

const campo = (col, fila = 0, extra = {}) => ({ col, fila, ...extra });
const con_titulo = { titulo: true };
const centrado = { centrado: true };

module.exports = {
    id: 'consulta-externa',
    plantilla: 'SINBA-SIS-01-P-2026.xlsx',
    hoja: 'SINBA-SIS-01-P 2026',

    // Datos del encabezado: una celda (combinada) por dato, en la fila 6.
    encabezado: {
        clues: 'B6',
        nombre_unidad: 'F6',
        curp_prestador: 'Y6',
        nombre_prestador: 'AC6',
        tipo_personal: 'AY6',
        cedula_profesional: 'BH6',
    },

    // La fecha está dibujada como tres recuadros (día, mes, año) en la fila 3.
    fecha: {
        fila: 3,
        dia: { rango: ['BG', 'BI'] },
        mes: { rango: ['BK', 'BM'] },
        anio: { rango: ['BN', 'BQ'] },
        estilo_base: 12,
    },

    registros: {
        fila_inicial: 14,
        altura_bloque: 4,
        maximo_por_hoja: 5,
        campos: {
            // Identificación
            servicio: campo('B'),
            derechohabiencia: campo('C'),
            folio_receta: campo('D'),
            expediente: campo('F'),
            curp: campo('C', 2),                    // C16 (la etiqueta queda en C15)
            nombre: campo('C', 3, con_titulo),      // C17:G17 (etiqueta + valor)

            // Datos del paciente
            edad: campo('H'),
            sexo: campo('I'),
            afromexicano: campo('J'),
            indigena: campo('K'),
            migrante: campo('L'),

            // Mediciones
            peso: campo('M', 1, centrado),          // M15
            talla: campo('M', 3, centrado),         // M17
            cintura: campo('N'),
            presion_diastolica: campo('O', 0, con_titulo),
            presion_sistolica: campo('O', 2, con_titulo),
            frecuencia_cardiaca: campo('P', 1, centrado),      // P15
            frecuencia_respiratoria: campo('P', 3, centrado),  // P17
            temperatura: campo('Q'),
            saturacion_oxigeno: campo('R'),
            glucosa_ayuno: campo('S'),
            glucosa_resultado: campo('T', 1, centrado),   // T15
            glucosa_tiras: campo('T', 3, centrado),       // T17
            probable_tb: campo('U'),

            // Contexto de la consulta
            primera_vez_uneme: campo('V'),
            primera_vez_anio: campo('W'),
            discapacidad_a: campo('X', 0, con_titulo),
            discapacidad_b: campo('X', 1, con_titulo),
            discapacidad_c: campo('X', 3, con_titulo),
            relacion_temporal_motivo: campo('Y'),

            // Diagnósticos CIE-10 (hasta tres por consulta)
            diagnostico1: campo('Z', 0),
            diagnostico2: campo('Z', 1),
            diagnostico3: campo('Z', 3),
            confirmacion_diagnostica: campo('AC'),
            diagnostico2_primera_vez: campo('AB', 2, centrado),   // AB16 (debajo de "1ª vez")
            diagnostico3_primera_vez: campo('AB', 3, con_titulo), // AB17 (conserva "1ª vez")

            // Salud mental y adicciones
            salud_mental_adicciones: campo('AD'),

            // Salud reproductiva
            pregestacional_relacion_temporal: campo('AE'),
            pregestacional_riesgos: campo('AF'),
            embarazo_relacion_temporal: campo('AG'),
            embarazo_plan_seguridad: campo('AH'),
            embarazo_trimestre: campo('AI'),
            embarazo_alto_riesgo_primera_vez: campo('AJ'),
            embarazo_complicaciones: campo('AK'),
            embarazo_otras_acciones: campo('AL'),
            puerperio_relacion_temporal: campo('AM'),
            puerperio_infeccion: campo('AN'),
            terapia_hormonal: campo('AO'),

            // Otros eventos
            otros_eventos_primera_vez: campo('AP'),
            otros_eventos_subsecuente: campo('AQ'),

            // Salud del niño y del adolescente
            nino_sano: campo('AR'),
            edi_tipo: campo('AS'),
            edi_resultado: campo('AT'),
            battelle_resultado: campo('AU'),
            eda_relacion_temporal: campo('AV'),
            eda_plan_tratamiento: campo('AW'),
            eda_recuperado: campo('AX'),
            eda_sobres_vso: campo('AY'),
            ira_relacion_temporal: campo('AZ'),
            ira_tipo_tratamiento: campo('BA'),
            ira_neumonia: campo('BB'),
            cedula_cancer: campo('BC'),
            madre_prevencion_accidentes: campo('BD'),

            // Intervenciones gerontológicas y promoción de la salud
            intervenciones_gerontologicas: campo('BE'),
            consulta_integrada_linea_vida: campo('BF'),
            presenta_cartilla: campo('BG'),
            esquema_vacunacion: campo('BH'),
            albendazol_promocion: campo('BI'),
            sobres_vso_promocion: campo('BJ'),

            // Referencia, contrarreferencia y teleconsulta
            referido_por: campo('BK'),
            referido_nivel: campo('BL', 1, centrado),           // BL15
            referido_especialidad: campo('BL', 3, centrado),    // BL17
            contrarreferido: campo('BM'),
            teleconsulta_unidad: campo('BN'),
            teleconsulta_interpretacion_a: campo('BO', 1, centrado),  // BO15
            teleconsulta_interpretacion_b: campo('BO', 3, centrado),  // BO17
            teleconsulta_modalidad: campo('BP'),
            fecha_proxima_cita: campo('BQ'),
        },
    },
};