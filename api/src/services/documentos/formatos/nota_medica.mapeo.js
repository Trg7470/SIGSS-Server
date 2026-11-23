'use strict';

/**
 * Mapeo de la vista `vista_nota_medica` (MySQL) a las llaves que espera
 * `nota_medica.config.js` para llenar la plantilla.
 *
 * A diferencia de consulta_externa/planificacion_familiar, aquí no hay
 * "encabezado" aparte: cada registro ya trae todos sus datos (unidad,
 * paciente, signos vitales y narrativa), porque la plantilla imprime la
 * misma nota dos veces en la hoja (ORIGINAL y COPIA). Por eso
 * `consultar_formato.service.js` duplica el registro antes de mandarlo a
 * `generar_xls` -- aquí solo se mapea una fila de la vista.
 */

const { resolver_catalogo } = require('../../../utils/catalogos');

/** Acepta un Date (lo que regresa mysql2 para DATE/DATETIME) o un string
 *  'AAAA-MM-DD'/ISO y devuelve 'DD/MM/AAAA'. Vacío si no hay fecha. */
function formatear_fecha(valor) {
    if (!valor) return undefined;
    if (valor instanceof Date && !Number.isNaN(valor.getTime())) {
        const dia = String(valor.getDate()).padStart(2, '0');
        const mes = String(valor.getMonth() + 1).padStart(2, '0');
        return `${dia}/${mes}/${valor.getFullYear()}`;
    }
    const iso = String(valor).slice(0, 10);
    const [anio, mes, dia] = iso.split('-');
    if (!anio || !mes || !dia) return undefined;
    return `${dia}/${mes}/${anio}`;
}

/** 'HH:mm:ss' (TIME de MySQL, viene como string) -> 'HH:mm'. */
function formatear_hora(valor) {
    if (!valor) return undefined;
    return String(valor).slice(0, 5);
}

function calcular_imc(peso, talla_cm) {
    const p = Number(peso);
    const t = Number(talla_cm);
    if (!p || !t) return undefined;
    const metros = t / 100;
    return (p / (metros * metros)).toFixed(1);
}

module.exports = {
    // --- Unidad y folio ---
    clues: { columna: 'clues' },
    nombre_unidad: { columna: 'nombre_unidad' },
    expediente: { columna: 'expediente' },
    folio_receta: { columna: 'folio_receta' },
    fecha: { calcular: (fila) => formatear_fecha(fila.fecha) },
    hora: { calcular: (fila) => formatear_hora(fila.hora) },
    proxima_cita: { calcular: (fila) => formatear_fecha(fila.fecha_proxima_cita) },

    // --- Ficha de identificación del paciente ---
    paciente: { columna: 'nombre' },
    curp: { columna: 'curp' },
    sexo: { columna: 'sexo_biologico_id', catalogo: 'sexo_biologico' },
    edad: {
        calcular: (fila) => {
            if (fila.edad === null || fila.edad === undefined) return undefined;
            const unidad = resolver_catalogo('clave_edad', fila.clave_edad_id);
            return `${fila.edad} ${unidad}`;
        },
    },
    fecha_nacimiento: { calcular: (fila) => formatear_fecha(fila.fecha_nacimiento) },
    medico: { columna: 'nombre_prestador' },
    cedula_profesional: { columna: 'cedula_profesional' },

    // --- Signos vitales ---
    peso: { columna: 'peso' },
    talla: { columna: 'talla' },
    imc: { calcular: (fila) => calcular_imc(fila.peso, fila.talla) },
    frecuencia_cardiaca: { columna: 'frecuencia_cardiaca' },
    frecuencia_respiratoria: { columna: 'frecuencia_respiratoria' },
    temperatura: { columna: 'temperatura' },
    tension_arterial: {
        calcular: (fila) => (fila.presion_sistolica != null && fila.presion_diastolica != null)
            ? `${fila.presion_sistolica}/${fila.presion_diastolica}`
            : undefined,
    },
    saturacion_oxigeno: { columna: 'saturacion_oxigeno' },
    glucosa_capilar: { columna: 'glucosa_capilar' },

    // --- Narrativa clínica ---
    motivo_consulta: { columna: 'motivo_consulta' },
    padecimiento_actual: { columna: 'padecimiento_actual' },
    exploracion_fisica: { columna: 'exploracion_fisica' },
    resultado_estudios: { columna: 'resultado_estudios' },

    // --- Diagnóstico(s): uno por línea, solo los que vengan con valor ---
    diagnosticos: {
        calcular: (fila) => {
            const lineas = [fila.diagnostico1, fila.diagnostico2, fila.diagnostico3]
                .filter(Boolean)
                .map((nombre) => ` | ${nombre}`);
            return lineas.length ? lineas.join('\n') : undefined;
        },
    },

    // --- Plan de tratamiento: uno por línea, solo los que vengan con valor ---
    plan_tratamiento: {
        calcular: (fila) => {
            const lineas = [fila.tratamiento1, fila.tratamiento2, fila.tratamiento3]
                .filter(Boolean);
            return lineas.length ? lineas.join('\n') : undefined;
        },
    },

    // --- Cierre ---
    pronostico: { columna: 'pronostico' },
};