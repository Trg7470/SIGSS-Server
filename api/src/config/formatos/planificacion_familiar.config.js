'use strict';

/**
 * Configuración del formato SINBA-SIS-CAPF-P 2026
 * "Hoja diaria de consultas y atenciones de planificación familiar".
 *
 * Igual que en SINBA-SIS-01-P: cada hoja tiene 5 bloques de captura (uno por
 * consulta), y cada bloque ocupa 4 filas a partir de la fila 13 (no 14, como
 * en el formato de consulta externa). En la configuración de campos:
 *
 *   col      -> columna de la plantilla.
 *   fila     -> desplazamiento dentro del bloque (0 a 3). La celda real es
 *               fila_inicial + (consulta * altura_bloque) + fila.
 *   desborda -> true si el texto debe extenderse sobre celdas vecinas vacías
 *               (celdas no combinadas).
 *   titulo   -> true si la celda ya trae una etiqueta impresa (DIASTÓLICA,
 *               1ª vez, a, b, c, 8, 9...) que debe conservarse junto al valor.
 *   centrado -> true para centrar horizontalmente el valor (celdas sueltas
 *               debajo de su etiqueta: Peso/Talla, Cardiaca/Respiratoria,
 *               implante a/b, referido nivel/especialidad, teleconsulta a/b).
 *
 * IMPORTANTE: las llaves de "registros.campos" son el contrato con el
 * frontend. Si cambias un nombre aquí, debes cambiarlo también donde se
 * arma el objeto "registro" antes de enviarlo.
 *
 * NOTA sobre "fecha": a diferencia de SINBA-SIS-01-P, en esta plantilla el
 * recuadro "FECHA: DÍA / MES / AÑO" (fila 3-4, columnas AP-BB) no está hecho
 * con celdas combinadas con borde, sino con un objeto flotante (cuadro de
 * texto agrupado) dibujado encima de la hoja. Las celdas AP4/AU4/AZ4 abajo
 * son mi mejor estimación de dónde caen los tres tercios del recuadro
 * dibujado (verificado generando un render de prueba), pero no están
 * delimitadas por bordes de celda como el resto del formato: conviene
 * confirmarlas abriendo la plantilla y escribiendo un día/mes/año de prueba
 * antes de usarlas en producción.
 */

const campo = (col, fila = 0, extra = {}) => ({ col, fila, ...extra });
const con_titulo = { titulo: true };
const centrado = { centrado: true };
const desborda = { desborda: true };

module.exports = {
    id: 'planificacion-familiar',
    plantilla: 'SINBA-SIS-CAPF-P-2026.xlsx',
    hoja: 'ANVERSO',

    // Datos del encabezado: una celda por dato. A diferencia de
    // SINBA-SIS-01-P, aquí las etiquetas están repartidas entre las filas 5
    // y 6, y el valor de "curp_prestador" queda en la misma fila 5 que su
    // etiqueta (a la derecha), no en la fila 6.
    //
    // "nombre_prestador" es un caso especial: en O6 no hay una etiqueta
    // aparte, la plantilla trae impresa ahí mismo "NOMBRE DE LA O EL
    // PRESTADOR DE SERVICIO:" y ese es el único lugar donde existe ese
    // texto. Por eso se marca con titulo:true (igual que los campos del
    // registro con esa bandera) para que generar_xls.service.js conserve
    // la etiqueta y solo le anexe el valor, en vez de sobreescribirla.
    encabezado: {
        clues: 'B6',
        nombre_unidad: 'F6',
        curp_prestador: 'P5',
        nombre_prestador: { celda: 'O6', titulo: true},
        tipo_personal: 'AA6',
        cedula_profesional: 'AU6',
    },

    // Recuadro "FECHA" dibujado como objeto flotante (ver nota arriba).
    // `rango` es obligatorio: generar_xls.service.js hace
    // `const [desde, hasta] = cfg_fecha[parte].rango` para combinar las
    // celdas de cada recuadro (día/mes/año), igual que en SINBA-SIS-01-P.
    // Repartí las columnas AP-BB (el ancho del objeto flotante) en tres
    // tercios; estilo_base=3 es el estilo que ya traen AU4/AZ4 en la
    // plantilla (el de la mayoría de la fila 4).
    fecha: {
        fila: 3,
        dia: { rango: ['AT', 'AU'] },
        mes: { rango: ['AV', 'AY'] },
        anio: { rango: ['AZ', 'BA'] },
        estilo_base: 3,
    },

    registros: {
        fila_inicial: 13,
        altura_bloque: 4,
        maximo_por_hoja: 5,
        campos: {
            // Identificación
            servicio: campo('B'),
            derechohabiencia: campo('C'),                       // C13 (nota 1)
            folio_receta: campo('D'),                           // D13:E13
            expediente: campo('F'),                              // F13:G13
            curp: campo('C', 2, { ...con_titulo, ...desborda }), // C14, desborda sobre D14:G14
            nombre: campo('C', 3, con_titulo),                   // C16:G16

            // Datos del paciente
            edad: campo('H'),                 // nota 2
            sexo: campo('I'),                 // nota 3
            afromexicano: campo('J'),
            indigena: campo('K'),
            migrante: campo('L'),             // nota 4

            // Mediciones
            peso: campo('M', 1, centrado),                       // M14
            talla: campo('M', 3, centrado),                      // M16
            cintura: campo('N'),
            presion_diastolica: campo('O', 0, con_titulo),       // O13:O14
            presion_sistolica: campo('O', 2, con_titulo),        // O15:O16
            frecuencia_cardiaca: campo('P', 1, centrado),        // P14
            frecuencia_respiratoria: campo('P', 3, centrado),    // P16
            temperatura: campo('Q'),
            saturacion_oxigeno: campo('R'),
            glucosa_ayuno: campo('S'),

            // Contexto de la consulta
            primera_vez_anio: campo('T'),
            discapacidad_a: campo('U', 0, con_titulo),           // nota 5 a)
            discapacidad_b: campo('U', 1, con_titulo),           // U14:U15, b)
            discapacidad_c: campo('U', 3, con_titulo),           // c)
            relacion_temporal_motivo: campo('V'),                // nota RT

            // Diagnósticos CIE-10 (hasta tres por consulta)
            diagnostico1: campo('W', 0),                         // W13:X13
            diagnostico2: campo('W', 1),                         // W14:X15
            diagnostico3: campo('W', 3),                         // W16:X16
            diagnostico2_primera_vez: campo('Y', 1, con_titulo), // Y14:Y15 (conserva "1ª vez")
            diagnostico3_primera_vez: campo('Y', 3, con_titulo), // Y16 (conserva "1ª vez")

            // Planificación familiar
            puerpera_aceptante: campo('Z'),
            metodo_oral: campo('AA'),
            metodo_inyectable_mensual: campo('AB'),
            metodo_inyectable_bimestral: campo('AC'),
            metodo_inyectable_trimestral: campo('AD'),
            implante_subdermico_a: campo('AE', 1, centrado),     // nota 6 a) una varilla
            implante_subdermico_b: campo('AE', 3, centrado),     // nota 6 b) doble varilla
            metodo_parche_dermico: campo('AF'),
            metodo_diu: campo('AG'),
            metodo_diu_medicado: campo('AH'),
            metodo_quirurgico: campo('AI'),
            metodo_preservativo: campo('AJ'),
            metodo_preservativo_femenino: campo('AK'),
            metodo_otro: campo('AL'),
            anticoncepcion_emergencia: campo('AM'),
            alta_azoospermia_vasectomia: campo('AN'),

            // Orientación - consejería
            orientacion_planificacion_familiar: campo('AO'),
            orientacion_prevencion_its: campo('AP'),
            orientacion_prevencion_embarazo: campo('AQ'),
            otras_atenciones_ssra: campo('AR'),

            // Promoción de la salud
            consulta_integrada_linea_vida: campo('AS'),
            presenta_cartilla: campo('AT'),
            esquema_vacunacion: campo('AU'),                     // nota 7

            // Referencia, contrarreferencia y teleconsulta
            referido: campo('AV'),
            referido_nivel: campo('AW', 1, centrado),            // nota 8
            referido_especialidad: campo('AW', 3, centrado),     // nota 9
            contrarreferido: campo('AX'),
            teleconsulta_unidad: campo('AY'),
            teleconsulta_interpretacion_a: campo('AZ', 1, centrado), // nota 10 a)
            teleconsulta_interpretacion_b: campo('AZ', 3, centrado), // nota 10 b)
            teleconsulta_modalidad: campo('BA'),                 // nota 11

            // Próxima cita
            fecha_proxima_cita: campo('BB'),
        },
    },
};