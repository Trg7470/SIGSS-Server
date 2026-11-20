'use strict';

/**
 * Configuración del formato "Nota Médica" (SIGSS-NM-01).
 */

const campo = (col, fila = 0, extra = {}) => ({ col, fila, ...extra });
const centrado = { centrado: true };

module.exports = {
    id: 'nota-medica',
    plantilla: 'SIGSS-NOTA-MEDICA.xlsx',
    hoja: 'Nota Médica',

    registros: {
        fila_inicial: 1,
        altura_bloque: 35,   // ORIGINAL empieza en la fila 1, COPIA en la 36
        maximo_por_hoja: 2,  // las dos "copias" de la misma consulta
        campos: {
            // Datos de la unidad (se repiten igual en ambas copias)
            clues: campo('C', 2),
            nombre_unidad: campo('I', 2),
            expediente: campo('Q', 2),
            folio_receta: campo('C', 3),
            fecha: campo('I', 3),               // texto "DD/MM/AAAA", no usa el recuadro de SINBA
            hora: campo('O', 3),                // no se captura hoy en Registrar Consulta (ver nota)

            // Ficha de identificación del paciente
            paciente: campo('C', 5),
            curp: campo('Q', 5),
            sexo: campo('C', 6),
            edad: campo('G', 6),                // ya viene compuesta, p. ej. "21 AÑOS"
            fecha_nacimiento: campo('M', 6),    // no se envía hoy desde Registrar Consulta (ver nota)

            // Signos vitales
            peso: campo('C', 7, centrado),
            talla: campo('G', 7, centrado),
            imc: campo('K', 7, centrado),       // calculado, no se captura directo (ver nota)
            frecuencia_cardiaca: campo('O', 7, centrado),
            frecuencia_respiratoria: campo('S', 7, centrado),
            temperatura: campo('C', 8, centrado),
            tension_arterial: campo('G', 8, centrado),   // "sistólica/diastólica" ya armado, p. ej. "120/80"
            saturacion_oxigeno: campo('M', 8, centrado),
            glucosa_capilar: campo('S', 8, centrado),

            // Narrativa clínica (texto libre; hoy sin fuente en la BD, ver nota)
            motivo_consulta: campo('A', 11),
            padecimiento_actual: campo('A', 13),
            exploracion_fisica: campo('A', 15),
            resultado_estudios: campo('A', 17),

            // Diagnóstico(s) (caja de texto, uno por línea si hay varios)
            diagnosticos: campo('A', 20),

            // Plan de estudios y/o tratamiento (caja de texto, texto libre)
            plan_tratamiento: campo('A', 24),

            // Cierre
            pronostico: campo('C', 28),          // texto libre, sin fuente en la BD hoy
            proxima_cita: campo('P', 28),
            medico: campo('C', 29),
            cedula_profesional: campo('R', 29),
        },
    },
};