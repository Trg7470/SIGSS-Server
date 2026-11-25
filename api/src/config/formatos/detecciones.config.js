'use strict';

/**
 * Configuración del formato SINBA-SIS-DET-P 2026
 * "Hoja diaria de detecciones".
 *
 * Mismo mecanismo que salud_bucal.config.js: 5 bloques de captura (uno por
 * consulta) de 4 filas cada uno, a partir de la fila 14 (la fila 13 es la
 * leyenda de numeración del instructivo, compartida por toda la hoja, no
 * por cada bloque).
 *
 *   col    -> columna de la plantilla.
 *   fila   -> desplazamiento dentro del bloque (0 a 3). La celda real es
 *             fila_inicial + (consulta * altura_bloque) + fila.
 *   titulo -> true si la celda ya trae una etiqueta impresa (Peso/Talla,
 *             DIASTÓLICA/SISTÓLICA, VEF1/CVF, a/b/c...) que debe
 *             conservarse junto al valor.
 *
 * Varias columnas empacan DOS valores distintos en el mismo bloque, uno en
 * fila 0 y otro en fila 2 (igual que O y P con presión/frecuencia):
 *   - BJ: fila 0 = resultado ITS de A539 (pregunta 10), fila 2 = tipo de
 *     prueba treponémica/no treponémica (pregunta 15) — vive aquí porque
 *     esa clasificación solo aplica a la prueba de sífilis (A539).
 *   - BP: fila 0 = cáncer cervicouterino realizado (pregunta 11),
 *     fila 2 = resultado de la detección (pregunta 7).
 *   - BX: fila 0 = VEF1/CVF combinados (con título), fila 1 = LIN (con
 *     título), fila 3 = resultado de espirometría (pregunta 13, catálogo
 *     Cat_Espirometria_Resultados).
 * BC (inhalables) trae las 4 filas del bloque fusionadas en una sola celda
 * (así está en la plantilla oficial, se respeta tal cual).
 *
 * IMPORTANTE: las llaves de "registros.campos" son el contrato con el
 * frontend y con detecciones.mapeo.js. Si cambias un nombre aquí,
 * cámbialo también en ambos lugares.
 */

const campo = (col, fila = 0, extra = {}) => ({ col, fila, ...extra });
const con_titulo = { titulo: true };
// Algunas celdas de la plantilla oficial traen impreso el numerito de la
// pregunta del instructivo (no una etiqueta legible como "Peso" o "a"), así
// que cuando no hay valor NO se debe conservar: se sobrescribe con vacío
// únicamente en el archivo generado (la plantilla fuente no se toca).
const limpia_si_vacio = { limpiar_si_vacio: true };

module.exports = {
    id: 'detecciones',
    plantilla: 'SINBA-SIS-DET-P_2026.xlsx',
    hoja: 'ANVERSO', // nombre real de la pestaña dentro del archivo

    // Datos del encabezado: ver filas 5-6 de la plantilla.
    encabezado: {
        clues: 'B6',
        nombre_unidad: 'F6',
        curp_prestador: 'Q5',
        // P6 ya trae impresa la etiqueta "NOMBRE DE LA O EL PRESTADOR DE
        // SERVICIO:"; se conserva junto con el valor.
        nombre_prestador: { celda: 'P6', titulo: true },
        tipo_personal: 'AM6',
        cedula_profesional: 'BO6',
    },

    // El recuadro de FECHA está dibujado (forma, no celdas) sobre las
    // columnas BM-BY, filas 3-5 — mismo mecanismo que salud bucal, solo
    // que aquí el dibujo empieza más a la derecha. BO, BS y BX están
    // vacías en la fila 3 y suficientemente separadas entre sí para que
    // el desborde de cada valor no choque con el de al lado.
    fecha: {
        fila: 3,
        dia: { rango: ['BO', 'BO'] },
        mes: { rango: ['BS', 'BS'] },
        anio: { rango: ['BX', 'BX'] },
        estilo_base: 12,
        // Igual que en salud bucal: estas columnas tienen anchos distintos
        // y las reutilizan otros campos más abajo en la hoja, así que no
        // se pueden ensanchar solo para la fecha.
        encoger_a_la_celda: false,
    },

    registros: {
        fila_inicial: 14,
        altura_bloque: 4,
        maximo_por_hoja: 5,
        campos: {
            // Identificación
            servicio: campo('B'),
            derechohabiencia: campo('C'),
            expediente: campo('D'),
            // No hay columna de folio de receta en este formato (a
            // diferencia de consulta externa / salud bucal): la vista
            // vista_detecciones no selecciona folio_receta.
            curp: campo('C', 2),                     // la etiqueta queda impresa en C15
            nombre: campo('C', 3, con_titulo),       // C17:G17 (etiqueta + valor)

            // Datos del paciente
            edad: campo('H'),
            sexo: campo('I'),
            afromexicano: campo('J'),
            indigena: campo('K'),
            migrante: campo('L'),

            // Mediciones
            // Peso y Talla ya traen su etiqueta impresa en la misma
            // columna (M14='Peso', M16='Talla'), a diferencia de salud
            // bucal donde la etiqueta vivía en una columna aparte.
            peso: campo('M', 0, con_titulo),
            talla: campo('M', 2, con_titulo),
            cintura: campo('N'),
            presion_diastolica: campo('O', 0, con_titulo),
            presion_sistolica: campo('O', 2, con_titulo),
            frecuencia_cardiaca: campo('P', 0, con_titulo),
            frecuencia_respiratoria: campo('P', 2, con_titulo),
            temperatura: campo('Q'),
            saturacion_oxigeno: campo('R'),
            // La plantilla solo trae una celda para glucosa + ayuno
            // juntos (ver detecciones.mapeo.js: "118 mg/dL / Ayuno: Si").
            glucosa_y_ayuno: campo('S'),
            tiras_utilizadas: campo('T'),
            primera_vez_anio: campo('U'),

            // Discapacidad (mismo patrón a/b/c que salud bucal)
            discapacidad_a: campo('V', 0, con_titulo),
            discapacidad_b: campo('V', 1, con_titulo),
            discapacidad_c: campo('V', 3, con_titulo),

            // Embarazo
            prueba_rapida_hcg: campo('W'),
            esta_embarazada: campo('X'),

            // Depresión / ansiedad
            frecuentemente_triste: campo('Y'),
            depresion: campo('Z'),
            ansiedad: campo('AA'),

            // Detecciones y revaloraciones 60 y más años
            revaloracion_ha_olvidado: campo('AB'),
            revaloracion_alteracion_memoria: campo('AC'),
            revaloracion_demencia_id: campo('AD'),
            revaloracion_fuga_orina: campo('AE'),
            revaloracion_incontinencia_urinaria: campo('AF'),
            revaloracion_tiene_caidas: campo('AG'),
            revaloracion_sindrome_caidas: campo('AH'),
            revaloracion_estabilidad_marcha: campo('AI'),
            revaloracion_estado_nutricion: campo('AJ'),
            revaloracion_actividades_basicas: campo('AK'),
            revaloracion_evaluacion_abvd: campo('AL'),
            revaloracion_actividades_instrumentales: campo('AM'),
            revaloracion_evaluacion_aivd: campo('AN'),
            // Grupo edad / sexo / resultado de la revaloración general
            // (bajo el encabezado "SOBRECARGA DEL CUIDADOR", pero son el
            // grupo edad/sexo/resultado generales de la revaloración, no
            // de una columna Sobrecarga_Cuidador aparte — esa se elimina).
            revaloracion_grupo_edad_id: campo('AO'),
            revaloracion_sexo_id: campo('AP'),
            revaloracion_resultado: campo('AQ'),

            // Riesgo de fracturas por osteoporosis
            riesgo_fracturas_osteoporosis_id: campo('AR'),

            // Enfermedades cardiometabólicas
            cardio_diabetes_mellitus: campo('AS'),
            cardio_hipertension_arterial: campo('AT'),
            cardio_obesidad: campo('AU'),
            cardio_dislipidemias: campo('AV'),
            cardio_enfermedad_renal_cronica: campo('AW'),

            // Consumo de sustancias psicoactivas
            consumo_alcohol: campo('AX'),
            consumo_tabaco: campo('AY'),
            consumo_cannabis: campo('AZ'),
            consumo_cocaina: campo('BA'),
            consumo_metanfetaminas: campo('BB'),
            // BC trae las 4 filas del bloque fusionadas en la plantilla
            // oficial (confirmado, se respeta tal cual).
            consumo_inhalables: campo('BC'),
            consumo_opiaceos: campo('BD'),
            consumo_alucinogenos: campo('BE'),
            consumo_tranquilizantes: campo('BF'),
            consumo_otras_sustancias: campo('BG'),

            // ITS
            its_grupo_poblacional: campo('BH'),
            its_resultado_b24x: campo('BI'),
            its_resultado_a539: campo('BJ', 0, limpia_si_vacio),
            its_tipo_prueba_id: campo('BJ', 2, limpia_si_vacio),
            its_resultado_gonorrea: campo('BK'),
            its_resultado_hepatitis_b: campo('BL'),
            its_resultado_herpes_genital: campo('BM'),
            its_resultado_chlamydia: campo('BN'),
            its_resultado_vph: campo('BO'),

            // Cáncer / violencia / síndrome de Turner
            cancer_cervicouterino_realizado: campo('BP', 0, limpia_si_vacio),
            cancer_cervicouterino_resultado: campo('BP', 2, limpia_si_vacio),
            exploracion_cancer_mama_id: campo('BQ'),
            violencia_sexual: campo('BR'),
            violencia_mujeres_15_anos: campo('BS'),
            sindrome_turner: campo('BT'),

            // Hombres
            hiperplasia_prostatica: campo('BU'),
            reactivos_antigeno_prostatico_id: campo('BV'),

            // TB / espirometría
            probable_tb_estudio: campo('BW'),
            // VEF1 y CVF comparten una sola celda combinada (igual que
            // peso_talla en salud bucal: ver detecciones.mapeo.js).
            espirometria_vef1_cvf: campo('BX', 0, con_titulo),
            espirometria_lin: campo('BX', 1, con_titulo),
            espirometria_resultado_id: campo('BX', 3, limpia_si_vacio),

            // Promoción de la salud
            presenta_cartilla: campo('BY'),
        },
    },
};