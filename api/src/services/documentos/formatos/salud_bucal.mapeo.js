'use strict';

/**
 * Mapeo de la vista `vista_salud_bucal` (MySQL) a las llaves que espera
 * `salud_bucal.config.js` para llenar la plantilla.
 *
 * Mismo mecanismo que consulta_externa.mapeo.js:
 *   - Simple:    { columna, catalogo? } -> toma fila[columna] y, si hay
 *                catálogo, lo traduce con resolver_catalogo() (Nombre por
 *                default).
 *   - Booleano:  { columna, booleano: true } -> 1/0 de MySQL -> "Si"/"No".
 *   - Calculado: { calcular(fila) } -> para campos que dependen de más de
 *                una columna (ej. peso_talla combinados).
 *
 * `medicina_indigena_a/b/c` de la vista no se usa aquí: el instructivo de
 * la SINBA-SIS-02-P no tiene ningún campo de medicina tradicional en esta
 * hoja (solo lo tiene el checkbox demográfico "Indígena", ya mapeado como
 * `indigena`).
 */

const { resolver_catalogo } = require('../../../utils/catalogos');

module.exports = {
    // --- Identificación (passthrough, la vista ya trae el valor final) ---
    servicio: { columna: 'servicio' },
    derechohabiencia: { columna: 'derechohabiencia' },
    folio_receta: { columna: 'folio_receta' },
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
    // La plantilla solo tiene una celda para los dos valores juntos.
    // Si falta uno de los dos, se muestra solo el que haya.
    peso_talla: {
        calcular: (fila) => {
            const partes = [];
            if (fila.peso !== null && fila.peso !== undefined) {
                partes.push(`${fila.peso} Kg`);
            }
            if (fila.talla !== null && fila.talla !== undefined) {
                partes.push(`${fila.talla} cm`);
            }
            return partes.length ? partes.join(' / ') : undefined;
        },
    },
    cintura: { columna: 'cintura' },
    presion_diastolica: { columna: 'presion_diastolica' },
    presion_sistolica: { columna: 'presion_sistolica' },
    frecuencia_cardiaca: { columna: 'frecuencia_cardiaca' },
    frecuencia_respiratoria: { columna: 'frecuencia_respiratoria' },
    temperatura: { columna: 'temperatura' },
    saturacion_oxigeno: { columna: 'saturacion_oxigeno' },
    glucosa_ayuno: { columna: 'glucosa_ayuno', booleano: true },

    // --- Contexto de la consulta ---
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
    diagnostico2_primera_vez: { columna: 'diagnostico2_primera_vez', booleano: true },
    diagnostico3_primera_vez: { columna: 'diagnostico3_primera_vez', booleano: true },

    // --- Atención preventiva ---
    prev_deteccion_placa_bacteriana: { columna: 'prev_deteccion_placa_bacteriana', booleano: true },
    prev_instruccion_tecnica_cepillado: { columna: 'prev_instruccion_tecnica_cepillado', booleano: true },
    prev_instruccion_uso_hilo: { columna: 'prev_instruccion_uso_hilo', booleano: true },
    prev_aplicacion_topica_fluor: { columna: 'prev_aplicacion_topica_fluor', booleano: true },
    prev_aplicacion_barniz_fluor: { columna: 'prev_aplicacion_barniz_fluor', booleano: true },
    prev_limpieza_dental: { columna: 'prev_limpieza_dental', booleano: true },
    prev_raspado_alisado_radicular: { columna: 'prev_raspado_alisado_radicular', booleano: true },
    prev_rev_instruccion_higiene_protesis: { columna: 'prev_rev_instruccion_higiene_protesis', booleano: true },
    prev_rev_tejidos_bucales: { columna: 'prev_rev_tejidos_bucales', booleano: true },
    prev_instruccion_autoexploracion: { columna: 'prev_instruccion_autoexploracion', booleano: true },
    // Número de dientes sellados: numérico, no booleano.
    prev_sellado_fosetas_fisuras: { columna: 'prev_sellado_fosetas_fisuras' },

    // --- Atención curativa (todas numéricas: número de piezas/eventos) ---
    cur_amalgama: { columna: 'cur_amalgama' },
    cur_resinas: { columna: 'cur_resinas' },
    cur_ionomero_vidrio: { columna: 'cur_ionomero_vidrio' },
    cur_alkasite: { columna: 'cur_alkasite' },
    cur_material_temporal: { columna: 'cur_material_temporal' },
    cur_extraccion_diente_temporal: { columna: 'cur_extraccion_diente_temporal' },
    cur_extraccion_diente_permanente: { columna: 'cur_extraccion_diente_permanente' },
    cur_terapia_pulpar: { columna: 'cur_terapia_pulpar' },
    // Cirugía bucal y farmacoterapia sí son booleanos en Atencion_Curativa.
    cur_cirugia_bucal: { columna: 'cur_cirugia_bucal', booleano: true },
    cur_farmacoterapia: { columna: 'cur_farmacoterapia', booleano: true },
    cur_otras_atenciones: { columna: 'cur_otras_atenciones' },

    // --- Cierre de la atención ---
    // Radiografias es INTEGER en el esquema (número de radiografías
    // periapicales), no booleano.
    radiografias: { columna: 'radiografias' },
    tratamiento_integral_terminado: { columna: 'tratamiento_integral_terminado', booleano: true },
    orientacion_salud: { columna: 'orientacion_salud', booleano: true },

    // --- Promoción de la salud ---
    consulta_integrada_linea_vida: { columna: 'consulta_integrada_linea_vida', booleano: true },
    presenta_cartilla: { columna: 'presenta_cartilla', booleano: true },
    esquema_vacunacion: { columna: 'esquema_vacunacion_id', catalogo: 'esquema_vacunacion' },

    // --- Referencia, contrarreferencia y teleconsulta ---
    // BC = "¿Fue referido?" (Si/No). El instructivo de esta hoja no trae
    // catálogo de motivo de referido (a diferencia de Consulta Externa),
    // por eso aquí es booleano y no se resuelve contra Cat_Referido_Motivo.
    referido: { columna: 'referido', booleano: true },
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
                return `${dia}/${mes}/${fecha.getFullYear()}`;
            }
            return String(fecha);
        },
    },
};