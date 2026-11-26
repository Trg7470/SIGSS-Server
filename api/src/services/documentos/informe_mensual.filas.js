'use strict';

/**
 * Definición de filas del Informe Mensual, por módulo.
 *
 * Mismo criterio que detecciones.config.js / mapeo.js, pero aquí no hay una
 * plantilla xlsx oficial que abrir (como Bitácora, este informe se genera
 * de cero con generar_xls_informe_mensual.service.js), así que en vez de
 * una celda, cada "variable" lleva una `clave` corta que es la llave que
 * debe traer el objeto de totales calculado por SQL (un valor por clave,
 * filtrado por módulo + mes + año + unidad).
 *
 * tipo:
 *   'seccion'    -> encabezado de bloque (fondo azul fuerte, en negritas)
 *   'subseccion' -> encabezado de subgrupo (fondo azul claro, cursiva)
 *   'variable'   -> fila de dato, con `clave` para buscar su total
 *
 * Las filas 'seccion'/'subseccion' no necesitan `clave` (no llevan valor).
 */

const seccion = (texto) => ({ tipo: 'seccion', texto });
const subseccion = (texto) => ({ tipo: 'subseccion', texto });
const variable = (texto, clave) => ({ tipo: 'variable', texto, clave });

// --------------------------------------------------------------------
// PLANIFICACIÓN FAMILIAR
// --------------------------------------------------------------------
const METODOS_PF = [
    ['Oral', 'oral'],
    ['Inyectable mensual', 'iny_mensual'],
    ['Inyectable bimestral', 'iny_bimestral'],
    ['Inyectable trimestral', 'iny_trimestral'],
    ['Implante subdérmico (una varilla)', 'implante_1'],
    ['Implante subdérmico (doble varilla)', 'implante_2'],
    ['Parche dérmico', 'parche'],
    ['DIU', 'diu'],
    ['DIU medicado', 'diu_medicado'],
    ['Quirúrgico', 'quirurgico'],
    ['Preservativo', 'preservativo'],
    ['Preservativo femenino', 'preservativo_femenino'],
    ['Otro método', 'otro'],
];

const FILAS_PLANIFICACION_FAMILIAR = [
    seccion('PERSONAS USUARIAS ACTIVAS (por método entregado)'),
    subseccion('Menores de 20 años'),
    ...METODOS_PF.map(([texto, clave]) => variable(texto, `pf_menores20_${clave}`)),
    subseccion('20 años y más'),
    ...METODOS_PF.map(([texto, clave]) => variable(texto, `pf_20ymas_${clave}`)),
    seccion('OTROS INDICADORES'),
    variable('Puérpera aceptante', 'pf_puerpera_aceptante'),
    variable('Anticoncepción de emergencia proporcionada', 'pf_anticoncepcion_emergencia'),
    variable('Alta por azoospermia (post-vasectomía)', 'pf_alta_azoospermia'),
    variable('Orientación-Consejería: Planificación familiar', 'pf_orientacion_pf'),
    variable('Orientación-Consejería: Prevención de ITS', 'pf_orientacion_its'),
    variable('Orientación-Consejería: Prevención del embarazo', 'pf_orientacion_embarazo'),
    variable('Otras atenciones (Servicios Amigables SSRA)', 'pf_otras_atenciones_ssra'),
];

// --------------------------------------------------------------------
// DETECCIONES
// --------------------------------------------------------------------
const par_si_no = (etiqueta, clave) => ([
    variable(`${etiqueta} — Sí`, `${clave}_si`),
    variable(`${etiqueta} — No`, `${clave}_no`),
]);

const par_pos_neg = (etiqueta, clave) => ([
    variable(`${etiqueta} — Positivo`, `${clave}_pos`),
    variable(`${etiqueta} — Negativo`, `${clave}_neg`),
]);

const trio_riesgo = (etiqueta, clave) => ([
    variable(`${etiqueta} — Riesgo bajo`, `${clave}_bajo`),
    variable(`${etiqueta} — Riesgo mediano`, `${clave}_moderado`),
    variable(`${etiqueta} — Riesgo alto`, `${clave}_alto`),
]);

const bloque_its = (nombre, clave) => {
    const filas = [
        subseccion(nombre),
        variable('Reactiva / Positiva (tamizaje)', `${clave}_reactiva`),
        variable('No reactiva / Negativa (tamizaje)', `${clave}_no_reactiva`),
        variable('Confirmatoria positiva', `${clave}_confirmatoria_pos`),
        variable('Confirmatoria negativa', `${clave}_confirmatoria_neg`),
    ];
    if (clave === 'its_a539') {
        filas.push(
            variable('Tipo de prueba: Treponémica', 'its_a539_treponemica'),
            variable('Tipo de prueba: No treponémica', 'its_a539_no_treponemica'),
        );
    }
    return filas;
};

const FILAS_DETECCIONES = [
    seccion('INDICADORES OFICIALES SINBA'),
    variable('Síndrome de Turner — casos confirmados por cariotipo', 'det_turner_confirmados'),
    variable('Espirometría VEF1/CVF — resultado > LIN', 'det_espirometria_mayor_lin'),

    seccion('EMBARAZO'),
    ...par_pos_neg('Prueba rápida hCG', 'det_hcg'),
    ...par_si_no('¿Está embarazada?', 'det_esta_embarazada'),

    seccion('SALUD MENTAL'),
    ...par_si_no('Frecuentemente triste', 'det_frecuentemente_triste'),
    ...par_pos_neg('Depresión', 'det_depresion'),
    ...par_pos_neg('Ansiedad', 'det_ansiedad'),

    seccion('REVALORACIONES 60 Y MÁS AÑOS'),
    ...par_si_no('¿Ha olvidado alguna cosa importante?', 'det_reval_olvido'),
    ...par_si_no('Fuga de orina', 'det_reval_fuga_orina'),
    ...par_si_no('Tiene caídas', 'det_reval_tiene_caidas'),
    ...par_si_no('Actividades básicas de la vida diaria', 'det_reval_abvd_tamizaje'),
    ...par_si_no('Actividades instrumentales de la vida diaria', 'det_reval_aivd_tamizaje'),
    ...par_pos_neg('Alteración de la memoria', 'det_reval_memoria'),
    ...par_pos_neg('Incontinencia urinaria', 'det_reval_incontinencia'),
    ...par_pos_neg('Síndrome de caídas', 'det_reval_sindrome_caidas'),
    ...par_pos_neg('Estabilidad de la marcha', 'det_reval_marcha'),
    ...par_pos_neg('Estado de nutrición', 'det_reval_nutricion'),
    ...par_pos_neg('Evaluación ABVD', 'det_reval_abvd_resultado'),
    ...par_pos_neg('Evaluación AIVD', 'det_reval_aivd_resultado'),
    ...trio_riesgo('Riesgo de demencia', 'det_riesgo_demencia'),
    ...trio_riesgo('Riesgo de fracturas por osteoporosis', 'det_riesgo_osteoporosis'),

    seccion('ENFERMEDADES CARDIOMETABÓLICAS'),
    ...par_pos_neg('Diabetes mellitus', 'det_cardio_diabetes'),
    ...par_pos_neg('Hipertensión arterial', 'det_cardio_hipertension'),
    ...par_pos_neg('Obesidad', 'det_cardio_obesidad'),
    ...par_pos_neg('Dislipidemias', 'det_cardio_dislipidemias'),
    ...par_pos_neg('Enfermedad renal crónica', 'det_cardio_renal'),

    seccion('CONSUMO DE SUSTANCIAS PSICOACTIVAS'),
    ...par_pos_neg('Alcohol', 'det_consumo_alcohol'),
    ...par_pos_neg('Tabaco', 'det_consumo_tabaco'),
    ...par_pos_neg('Cannabis', 'det_consumo_cannabis'),
    ...par_pos_neg('Cocaína', 'det_consumo_cocaina'),
    ...par_pos_neg('Metanfetaminas', 'det_consumo_metanfetaminas'),
    ...par_pos_neg('Inhalables', 'det_consumo_inhalables'),
    ...par_pos_neg('Opiáceos', 'det_consumo_opiaceos'),
    ...par_pos_neg('Alucinógenos', 'det_consumo_alucinogenos'),
    ...par_pos_neg('Tranquilizantes', 'det_consumo_tranquilizantes'),
    ...par_pos_neg('Otras sustancias', 'det_consumo_otras'),

    seccion('INFECCIONES DE TRANSMISIÓN SEXUAL (ITS)'),
    ...bloque_its('B24X (VIH)', 'its_b24x'),
    ...bloque_its('A539 (Sífilis)', 'its_a539'),
    ...bloque_its('Gonorrea', 'its_gonorrea'),
    ...bloque_its('Hepatitis B', 'its_hepatitis_b'),
    ...bloque_its('Herpes genital', 'its_herpes'),
    ...bloque_its('Chlamydia', 'its_chlamydia'),
    ...bloque_its('VPH', 'its_vph'),

    seccion('CÁNCER Y VIOLENCIA'),
    variable('Citología cérvico-vaginal — Realizado', 'det_citologia_realizado'),
    variable('Citología cérvico-vaginal — No realizado', 'det_citologia_no_realizado'),
    ...par_pos_neg('Resultado citología', 'det_citologia_resultado'),
    variable('Exploración clínica cáncer de mama — Anormal', 'det_mama_anormal'),
    variable('Exploración clínica cáncer de mama — Normal', 'det_mama_normal'),
    ...par_pos_neg('Violencia sexual', 'det_violencia_sexual'),
    ...par_pos_neg('Violencia mujeres 15+ años', 'det_violencia_mujeres_15'),

    seccion('HOMBRES Y TB'),
    ...par_pos_neg('Hiperplasia prostática', 'det_hiperplasia_prostatica'),
    variable('Reactivos de antígeno prostático utilizados (total)', 'det_reactivos_antigeno_prostatico'),
    ...par_si_no('Probable TB por estudio', 'det_probable_tb'),
];

// --------------------------------------------------------------------
// SALUD BUCAL
// --------------------------------------------------------------------
const FILAS_SALUD_BUCAL = [
    seccion('ATENCIÓN PREVENTIVA'),
    variable('Detección de placa bacteriana', 'sb_deteccion_placa'),
    variable('Instrucción de técnica de cepillado', 'sb_instruccion_cepillado'),
    variable('Instrucción de uso de hilo dental', 'sb_instruccion_hilo'),
    variable('Aplicación tópica de flúor', 'sb_fluor_topico'),
    variable('Aplicación de barniz de flúor', 'sb_barniz_fluor'),
    variable('Limpieza dental', 'sb_limpieza_dental'),
    variable('Raspado y alisado radicular', 'sb_raspado_alisado'),
    variable('Revisión/instrucción de higiene de prótesis', 'sb_higiene_protesis'),
    variable('Revisión de tejidos bucales', 'sb_revision_tejidos'),
    variable('Instrucción de autoexploración de cavidad bucal', 'sb_autoexploracion'),
    variable('Piezas con sellado de fosetas y fisuras (suma)', 'sb_sellado_fosetas'),

    seccion('ATENCIÓN CURATIVA'),
    variable('Amalgamas (piezas)', 'sb_amalgamas'),
    variable('Resinas (piezas)', 'sb_resinas'),
    variable('Ionómero de vidrio (piezas)', 'sb_ionomero_vidrio'),
    variable('Alkasite (piezas)', 'sb_alkasite'),
    variable('Material temporal (piezas)', 'sb_material_temporal'),
    variable('Extracción de diente temporal (piezas)', 'sb_extraccion_temporal'),
    variable('Extracción de diente permanente (piezas)', 'sb_extraccion_permanente'),
    variable('Terapia pulpar (piezas)', 'sb_terapia_pulpar'),
    variable('Otras atenciones curativas (suma)', 'sb_otras_curativas'),
    variable('Cirugía bucal (consultas)', 'sb_cirugia_bucal'),
    variable('Farmacoterapia (consultas)', 'sb_farmacoterapia'),

    seccion('CIERRE DE LA ATENCIÓN'),
    variable('Radiografías periapicales (suma)', 'sb_radiografias'),
    variable('Tratamientos integrales terminados', 'sb_tratamiento_terminado'),
    variable('Orientación de salud otorgada', 'sb_orientacion_salud'),
];

// --------------------------------------------------------------------
// CONSULTA EXTERNA
// --------------------------------------------------------------------
const FILAS_CONSULTA_EXTERNA = [
    seccion('EMBARAZO Y PUERPERIO (oficial SINBA)'),
    subseccion('Ingresos por antecedente personal patológico'),
    variable('Hipertensión preexistente', 'ce_ingreso_hipertension'),
    variable('Padecimiento oncológico', 'ce_ingreso_oncologico'),
    variable('Cardiopatías', 'ce_ingreso_cardiopatias'),
    variable('Otros', 'ce_ingreso_otros'),
    variable('Ingresos con identificación de adicciones', 'ce_ingreso_adicciones'),

    subseccion('Plan de seguridad'),
    variable('Inicial', 'ce_plan_seguridad_inicial'),
    variable('Reforzamiento', 'ce_plan_seguridad_reforzamiento'),

    subseccion('Atención del embarazo'),
    variable('Menores de 15 años', 'ce_embarazo_menores15'),
    variable('15 a 19 años', 'ce_embarazo_15_19'),
    variable('20 años y más', 'ce_embarazo_20ymas'),
    variable('Migrante: No', 'ce_embarazo_migrante_no'),
    variable('Migrante: Nacional', 'ce_embarazo_migrante_nacional'),
    variable('Migrante: Internacional', 'ce_embarazo_migrante_internacional'),
    variable('Migrante: Retornado', 'ce_embarazo_migrante_retornado'),
    variable('Afromexicana', 'ce_embarazo_afromexicana'),

    subseccion('Control del puerperio'),
    variable('Ingresos', 'ce_puerperio_ingresos'),

    seccion('NIÑO Y ADOLESCENTE (dato simple, sin clasificación SINBA)'),
    variable("Consultas con 'Niño sano' registrado", 'ce_nino_sano'),
    variable('Consultas con EDA (enfermedad diarreica aguda) registrado', 'ce_eda'),
    variable('Consultas con IRA (infección respiratoria aguda) registrado', 'ce_ira'),
    variable('Consultas con prueba EDI aplicada', 'ce_edi'),
    variable('Consultas con resultado de Escala Battelle registrado', 'ce_battelle'),
    variable('Consultas con Cédula de detección de cáncer aplicada', 'ce_cedula_cancer'),
    variable('Consultas con intervención gerontológica registrada', 'ce_gerontologicas'),
    variable('Consultas con promoción de Albendazol', 'ce_albendazol'),
    variable('Sobres de Vida Suero Oral entregados (suma)', 'ce_sobres_vso'),
];

const MODULOS = {
    planificacion_familiar: {
        titulo: 'PLANIFICACIÓN FAMILIAR',
        nombre_hoja: 'Planificacion_Familiar',
        filas: FILAS_PLANIFICACION_FAMILIAR,
    },
    detecciones: {
        titulo: 'DETECCIONES',
        nombre_hoja: 'Detecciones',
        filas: FILAS_DETECCIONES,
    },
    salud_bucal: {
        titulo: 'SALUD BUCAL',
        nombre_hoja: 'Salud_Bucal',
        filas: FILAS_SALUD_BUCAL,
    },
    consulta_externa: {
        titulo: 'CONSULTA EXTERNA',
        nombre_hoja: 'Consulta_Externa',
        filas: FILAS_CONSULTA_EXTERNA,
    },
};

module.exports = { MODULOS };