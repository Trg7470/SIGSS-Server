'use strict';

/**
 * Mapeo de la vista `vista_detecciones` (MySQL) a las llaves que espera
 * `detecciones.config.js` para llenar la plantilla.
 *
 * Mismo mecanismo que salud_bucal.mapeo.js:
 *   - Simple:    { columna, catalogo? } -> toma fila[columna] y, si hay
 *                catálogo, lo traduce con resolver_catalogo() (Nombre por
 *                default).
 *   - Booleano:  { columna, booleano: true } -> 1/0 de MySQL -> "Si"/"No".
 *   - Calculado: { calcular(fila) } -> para campos que dependen de más de
 *                una columna (ej. peso_talla combinados en salud bucal).
 *
 * A diferencia de salud bucal, casi todos los campos de clave de catálogo
 * ya vienen resueltos a Clave dentro de la propia vista (los JOIN a
 * Cat_Resultados_ITS, Cat_Espirometria_Resultados, Cat_Grupos_Its, etc. ya
 * están hechos en SQL), así que aquí la mayoría son passthrough directo
 * sin `catalogo`.
 *
 * Sobrecarga_Cuidador se elimina de Detecciones_Revaloraciones y de la
 * vista, así que no se mapea ningún campo "revaloracion_sobrecarga_cuidador".
 *
 * Varios campos "BOOL" del instructivo en realidad no son un booleano
 * Sí/No: son catálogos de 2-3 opciones con su propia Clave entera
 * (confirmado con Ileana: la columna guarda el entero de la Clave
 * directamente, no un booleano con semántica invertida), agregados a
 * catalogos.json:
 *   - 6. RESPUESTA DE TAMIZAJE: 1.SI, 0.NO            -> catalogo: 'respuesta_tamizaje'
 *   - 7. RESULTADO DE LA DETECCIÓN: 0.POSITIVO, 1.NEGATIVO -> catalogo: 'resultado_deteccion'
 *   - 8. RESULTADO DEMENCIA Y OSTEOPOROSIS: 1/2/3 riesgo  -> catalogo: 'resultado_demencia_osteoporosis'
 *   - 9. EDAD CUIDADOR: 1/2/3                              -> catalogo: 'edad_cuidador'
 *   - 11. CÁNCER CERVICOUTERINO: 0.NO REALIZADO, 1.REALIZADO -> catalogo: 'cancer_cervicouterino'
 *   - 12. EXPLORACIÓN CLÍNICA CÁNCER DE MAMA: 1.ANORMAL, 0.NORMAL -> catalogo: 'exploracion_cancer_mama'
 */

const { resolver_catalogo } = require('../../../utils/catalogos');

module.exports = {
    // --- Identificación (passthrough, la vista ya trae el valor final) ---
    servicio: { columna: 'servicio' },
    derechohabiencia: { columna: 'derechohabiencia' },
    expediente: { columna: 'expediente' },
    curp: { columna: 'curp' },
    nombre: { columna: 'nombre_paciente' },

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
    // La plantilla solo tiene una celda para glucosa + ayuno juntos.
    // Si falta uno de los dos, se muestra solo el que haya.
    glucosa_y_ayuno: {
        calcular: (fila) => {
            const partes = [];
            if (fila.glucosa !== null && fila.glucosa !== undefined) {
                partes.push(`${fila.glucosa} mg/dL`);
            }
            if (fila.glucosa_ayuno !== null && fila.glucosa_ayuno !== undefined) {
                partes.push(fila.glucosa_ayuno ? 'Ayuno: Si' : 'Ayuno: No');
            }
            return partes.length ? partes.join(' / ') : undefined;
        },
    },
    tiras_utilizadas: { columna: 'tiras_utilizadas' },
    primera_vez_anio: { columna: 'primera_vez_anio' },

    // --- Discapacidad (la vista ya trae la Clave por inciso) ---
    discapacidad_a: { columna: 'discapacidad_a' },
    discapacidad_b: { columna: 'discapacidad_b' },
    discapacidad_c: { columna: 'discapacidad_c' },

    // --- Embarazo ---
    prueba_rapida_hcg: { columna: 'prueba_rapida_hcg', catalogo: 'resultado_deteccion' },
    esta_embarazada: { columna: 'esta_embarazada', catalogo: 'respuesta_tamizaje' },

    // --- Depresión / ansiedad ---
    frecuentemente_triste: { columna: 'frecuentemente_triste', catalogo: 'respuesta_tamizaje' },
    depresion: { columna: 'depresion', catalogo: 'resultado_deteccion' },
    ansiedad: { columna: 'ansiedad', catalogo: 'resultado_deteccion' },

    // --- Detecciones y revaloraciones 60 y más años ---
    revaloracion_ha_olvidado: { columna: 'revaloracion_ha_olvidado', catalogo: 'respuesta_tamizaje' },
    revaloracion_alteracion_memoria: { columna: 'revaloracion_alteracion_memoria', catalogo: 'resultado_deteccion' },
    revaloracion_demencia_id: { columna: 'revaloracion_demencia_id', catalogo: 'resultado_demencia_osteoporosis' },
    revaloracion_fuga_orina: { columna: 'revaloracion_fuga_orina', catalogo: 'respuesta_tamizaje' },
    revaloracion_incontinencia_urinaria: { columna: 'revaloracion_incontinencia_urinaria', catalogo: 'resultado_deteccion' },
    revaloracion_tiene_caidas: { columna: 'revaloracion_tiene_caidas', catalogo: 'respuesta_tamizaje' },
    revaloracion_sindrome_caidas: { columna: 'revaloracion_sindrome_caidas', catalogo: 'resultado_deteccion' },
    revaloracion_estabilidad_marcha: { columna: 'revaloracion_estabilidad_marcha', catalogo: 'resultado_deteccion' },
    revaloracion_estado_nutricion: { columna: 'revaloracion_estado_nutricion', catalogo: 'resultado_deteccion' },
    revaloracion_actividades_basicas: { columna: 'revaloracion_actividades_basicas', catalogo: 'respuesta_tamizaje' },
    revaloracion_evaluacion_abvd: { columna: 'revaloracion_evaluacion_abvd', catalogo: 'resultado_deteccion' },
    revaloracion_actividades_instrumentales: { columna: 'revaloracion_actividades_instrumentales', catalogo: 'respuesta_tamizaje' },
    revaloracion_evaluacion_aivd: { columna: 'revaloracion_evaluacion_aivd', catalogo: 'resultado_deteccion' },
    // Edad cuidador / sexo cuidador (bloque "Sobrecarga del Cuidador").
    revaloracion_grupo_edad_id: { columna: 'revaloracion_grupo_edad_id', catalogo: 'edad_cuidador' },
    revaloracion_sexo_id: { columna: 'revaloracion_sexo_id', catalogo: 'sexo_biologico' },
    revaloracion_resultado: { columna: 'revaloracion_resultado', catalogo: 'resultado_deteccion' },

    // --- Riesgo de fracturas por osteoporosis (comparte catálogo con demencia) ---
    riesgo_fracturas_osteoporosis_id: { columna: 'riesgo_fracturas_osteoporosis_id', catalogo: 'resultado_demencia_osteoporosis' },

    // --- Enfermedades cardiometabólicas ---
    cardio_diabetes_mellitus: { columna: 'cardio_diabetes_mellitus', catalogo: 'resultado_deteccion' },
    cardio_hipertension_arterial: { columna: 'cardio_hipertension_arterial', catalogo: 'resultado_deteccion' },
    cardio_obesidad: { columna: 'cardio_obesidad', catalogo: 'resultado_deteccion' },
    cardio_dislipidemias: { columna: 'cardio_dislipidemias', catalogo: 'resultado_deteccion' },
    cardio_enfermedad_renal_cronica: { columna: 'cardio_enfermedad_renal_cronica', catalogo: 'resultado_deteccion' },

    // --- Consumo de sustancias psicoactivas ---
    consumo_alcohol: { columna: 'consumo_alcohol', catalogo: 'resultado_deteccion' },
    consumo_tabaco: { columna: 'consumo_tabaco', catalogo: 'resultado_deteccion' },
    consumo_cannabis: { columna: 'consumo_cannabis', catalogo: 'resultado_deteccion' },
    consumo_cocaina: { columna: 'consumo_cocaina', catalogo: 'resultado_deteccion' },
    consumo_metanfetaminas: { columna: 'consumo_metanfetaminas', catalogo: 'resultado_deteccion' },
    consumo_inhalables: { columna: 'consumo_inhalables', catalogo: 'resultado_deteccion' },
    consumo_opiaceos: { columna: 'consumo_opiaceos', catalogo: 'resultado_deteccion' },
    consumo_alucinogenos: { columna: 'consumo_alucinogenos', catalogo: 'resultado_deteccion' },
    consumo_tranquilizantes: { columna: 'consumo_tranquilizantes', catalogo: 'resultado_deteccion' },
    consumo_otras_sustancias: { columna: 'consumo_otras_sustancias', catalogo: 'resultado_deteccion' },

    // --- ITS (la vista ya trae la Clave resuelta vía JOIN a los catálogos) ---
    its_grupo_poblacional: { columna: 'its_grupo_poblacional' },
    its_resultado_b24x: { columna: 'its_resultado_b24x' },
    its_resultado_a539: { columna: 'its_resultado_a539' },
    // Tipo de prueba (15. TIPO DE PRUEBA: 1.TREPONÉMICA, 2.NO TREPONÉMICA).
    // Tipo_Prueba no tiene FK a un Cat_ en el esquema, así que no se
    // resuelve en la vista; se agregó a catalogos.json como 'tipo_prueba'.
    its_tipo_prueba_id: { columna: 'its_tipo_prueba_id', catalogo: 'tipo_prueba' },
    its_resultado_gonorrea: { columna: 'its_resultado_gonorrea' },
    its_resultado_hepatitis_b: { columna: 'its_resultado_hepatitis_b' },
    its_resultado_herpes_genital: { columna: 'its_resultado_herpes_genital' },
    its_resultado_chlamydia: { columna: 'its_resultado_chlamydia' },
    its_resultado_vph: { columna: 'its_resultado_vph' },

    // --- Cáncer / violencia / síndrome de Turner ---
    cancer_cervicouterino_realizado: { columna: 'cancer_cervicouterino_realizado', catalogo: 'cancer_cervicouterino' },
    cancer_cervicouterino_resultado: { columna: 'cancer_cervicouterino_resultado', catalogo: 'resultado_deteccion' },
    exploracion_cancer_mama_id: { columna: 'exploracion_cancer_mama_id', catalogo: 'exploracion_cancer_mama' },
    // Violencia Sexual y Violencia Mujeres 15+ son ambas un resultado de
    // detección (pregunta 7: 0.Positivo, 1.Negativo), confirmado con Ileana.
    violencia_sexual: { columna: 'violencia_sexual', catalogo: 'resultado_deteccion' },
    violencia_mujeres_15_anos: { columna: 'violencia_mujeres_15_anos', catalogo: 'resultado_deteccion' },
    sindrome_turner: { columna: 'sindrome_turner', catalogo: 'resultado_deteccion' },

    // --- Hombres ---
    hiperplasia_prostatica: { columna: 'hiperplasia_prostatica', catalogo: 'resultado_deteccion' },
    reactivos_antigeno_prostatico_id: { columna: 'reactivos_antigeno_prostatico_id' },

    // --- TB / espirometría ---
    probable_tb_estudio: { columna: 'probable_tb_estudio', catalogo: 'respuesta_tamizaje' },
    // El formato oficial no trae una celda de VEF1 y otra de CVF: trae una
    // sola casilla "VEF1/CVF" que registra la razón (relación) como un solo
    // valor decimal (confirmado contra el instructivo y la plantilla
    // SINBA-SIS-DET-P_2026.xlsx). Por eso en la BD ahora es una sola
    // columna (Espirometria_VEF1_CVF, DECIMAL) y aquí es passthrough
    // directo, igual que espirometria_lin.
    espirometria_vef1_cvf: { columna: 'espirometria_vef1_cvf' },
    espirometria_lin: { columna: 'espirometria_lin' },
    espirometria_resultado_id: { columna: 'espirometria_resultado_id' },

    // --- Promoción de la salud ---
    presenta_cartilla: { columna: 'presenta_cartilla', booleano: true },
};