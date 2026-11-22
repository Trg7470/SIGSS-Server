'use strict';

/**
 * Configuración del formato SINBA-SIS-02-P 2026
 * "Hoja diaria de consulta externa de salud bucal. Intramuros".
 *
 * Mismo mecanismo que consulta_externa.config.js: 5 bloques de captura
 * (uno por consulta) de 4 filas cada uno, a partir de la fila 15 (no 14:
 * la fila 14 de esta plantilla es una sola fila de numeración de la
 * leyenda, compartida por toda la hoja, no por cada bloque).
 *
 *   col    -> columna de la plantilla.
 *   fila   -> desplazamiento dentro del bloque (0 a 3). La celda real es
 *             fila_inicial + (consulta * altura_bloque) + fila.
 *   titulo -> true si la celda ya trae una etiqueta impresa (Peso/Talla,
 *             CURP, a/b/c, 7/8...) que debe conservarse junto al valor.
 *   centrado -> true para centrar horizontalmente el valor.
 *
 * IMPORTANTE: las llaves de "registros.campos" son el contrato con el
 * frontend (salud_bucal.js) y con salud_bucal.mapeo.js. Si cambias un
 * nombre aquí, cámbialo también en ambos lugares.
 */

const campo = (col, fila = 0, extra = {}) => ({ col, fila, ...extra });
const con_titulo = { titulo: true };
const centrado = { centrado: true };

module.exports = {
    id: 'salud-bucal',
    plantilla: 'SINBA-SIS-02-P-2026.xlsx',
    hoja: 'ANVERSO', // nombre real de la pestaña dentro del archivo

    // Datos del encabezado: ver filas 5-6 de la plantilla.
    encabezado: {
        clues: 'B6',
        nombre_unidad: 'F6',
        curp_prestador: 'Q5',
        // P6 ya trae impresa la etiqueta "NOMBRE DE LA O EL PRESTADOR DE
        // SERVICIO:"; se conserva junto con el valor.
        nombre_prestador: { celda: 'P6', titulo: true },
        tipo_personal: 'AC6',
        cedula_profesional: 'AX6',
    },

    // El recuadro de FECHA está dibujado sobre las columnas AT-BI (filas
    // 3-5), pero cada dato se escribe en una sola celda centrada dentro
    // de ese dibujo, no en un rango combinado como en consulta externa.
    fecha: {
        fila: 3,
        dia: { rango: ['AZ', 'AZ'] },
        mes: { rango: ['BD', 'BD'] },
        anio: { rango: ['BG', 'BG'] },
        estilo_base: 12,
    },

    registros: {
        fila_inicial: 15,
        altura_bloque: 4,
        maximo_por_hoja: 5,
        campos: {
            // Identificación
            servicio: campo('B'),
            derechohabiencia: campo('C'),
            folio_receta: campo('D'),
            expediente: campo('F'),
            curp: campo('C', 2),                     // C17:G17 (la etiqueta queda en C16)
            nombre: campo('C', 3, con_titulo),       // C18:G18 (etiqueta + valor)

            // Datos del paciente
            edad: campo('H'),
            sexo: campo('I'),
            afromexicano: campo('J'),
            indigena: campo('K'),
            migrante: campo('L'),

            // Mediciones
            // La plantilla solo trae UNA celda combinada (M) para peso y
            // talla juntos; las etiquetas "Peso"/"Talla" están impresas
            // aparte, en la columna N. El valor se escribe combinado,
            // ej. "68 Kg / 165 cm" (ver salud_bucal.mapeo.js).
            peso_talla: campo('M'),
            cintura: campo('O'),
            presion_diastolica: campo('P', 0, con_titulo),
            presion_sistolica: campo('P', 2, con_titulo),
            frecuencia_cardiaca: campo('Q', 0, con_titulo),
            frecuencia_respiratoria: campo('Q', 2, con_titulo),
            temperatura: campo('R'),
            saturacion_oxigeno: campo('S'),
            glucosa_ayuno: campo('T'),

            // Contexto de la consulta
            primera_vez_anio: campo('U'),
            discapacidad_a: campo('V', 0, con_titulo),
            discapacidad_b: campo('V', 1, con_titulo),
            discapacidad_c: campo('V', 3, con_titulo),
            relacion_temporal_motivo: campo('W'),

            // Diagnósticos CIE-10 (hasta tres por consulta)
            diagnostico1: campo('X', 0),
            diagnostico2: campo('X', 1),
            diagnostico3: campo('X', 3),
            diagnostico2_primera_vez: campo('Z', 1, con_titulo),
            diagnostico3_primera_vez: campo('Z', 3, con_titulo),

            // Atención preventiva
            prev_deteccion_placa_bacteriana: campo('AA'),
            prev_instruccion_tecnica_cepillado: campo('AB'),
            prev_instruccion_uso_hilo: campo('AC'),
            prev_aplicacion_topica_fluor: campo('AD'),
            prev_aplicacion_barniz_fluor: campo('AE'),
            prev_limpieza_dental: campo('AF'),
            prev_raspado_alisado_radicular: campo('AG'),
            prev_rev_instruccion_higiene_protesis: campo('AH'),
            prev_rev_tejidos_bucales: campo('AI'),
            prev_instruccion_autoexploracion: campo('AJ'),
            prev_sellado_fosetas_fisuras: campo('AK'),

            // Atención curativa
            cur_amalgama: campo('AL'),
            cur_resinas: campo('AM'),
            cur_ionomero_vidrio: campo('AN'),
            cur_alkasite: campo('AO'),
            cur_material_temporal: campo('AP'),
            cur_extraccion_diente_temporal: campo('AQ'),
            cur_extraccion_diente_permanente: campo('AR'),
            cur_terapia_pulpar: campo('AS'),
            cur_cirugia_bucal: campo('AT'),
            cur_farmacoterapia: campo('AU'),
            cur_otras_atenciones: campo('AV'),

            // Cierre de la atención
            radiografias: campo('AW'),
            tratamiento_integral_terminado: campo('AX'),
            orientacion_salud: campo('AY'),

            // Promoción de la salud
            consulta_integrada_linea_vida: campo('AZ'),
            presenta_cartilla: campo('BA'),
            esquema_vacunacion: campo('BB'),

            // Referencia, contrarreferencia y teleconsulta
            referido_por: campo('BC'),
            referido_nivel: campo('BD', 0, con_titulo),
            referido_especialidad: campo('BD', 2, con_titulo),
            contrarreferido: campo('BE'),
            teleconsulta_unidad: campo('BF'),
            teleconsulta_interpretacion_a: campo('BG', 0, con_titulo),
            teleconsulta_interpretacion_b: campo('BG', 2, con_titulo),
            teleconsulta_modalidad: campo('BH'),
            fecha_proxima_cita: campo('BI'),
        },
    },
};