'use strict';

/**
 * Mapeo de la vista `vista_planificacion_familiar` (MySQL) a las llaves que
 * espera `planificacion-familiar.config.js` (SINBA-SIS-CAPF-P) para llenar
 * la plantilla.
 *
 * Mismo contrato que `consulta_externa.mapeo.js`:
 *   - Simple:    { columna, catalogo? } -> toma fila[columna] y, si hay
 *                catálogo, lo traduce con resolver_catalogo() (Nombre por
 *                default).
 *   - Booleano:  { columna, booleano: true } -> 1/0 de MySQL -> "Si"/"No".
 *   - Calculado: { calcular(fila) } -> para campos que dependen de más de
 *                una columna, o que usan 'clave' en vez de 'nombre'.
 *
 * Ya confirmado contra el esquema real (SIGSS.sql) y contra
 * `vista_planificacion_familiar.sql`: los "métodos entregados" son
 * cantidades (INTEGER), no booleanos; "puérpera aceptante",
 * "anticoncepción de emergencia", "alta por azoospermia" y los 3
 * campos de "orientación - consejería" sí son BOOL en
 * `Consulta_Planificacion_Familiar` / `Orientacion_Consejeria`. El
 * implante subdérmico ya viene resuelto a su Clave (0/1) desde la
 * vista (pivote por Inciso a/b), así que aquí es passthrough simple.
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

    // --- Contexto de la consulta ---
    // Confirmado: Consultas.Primera_Vez_Anio_Cobertura es BOOL.
    primera_vez_anio: { columna: 'primera_vez_anio', booleano: true },
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

    // --- Planificación familiar ---
    // Puerpera_Aceptante SÍ es BOOL; los "métodos entregados" son
    // INTEGER (cantidad de piezas entregadas), NO booleanos, salvo
    // DIU, DIU medicado y quirúrgico, que se reportan tal cual 0/1
    // (sin convertir a "Si"/"No").
    puerpera_aceptante: { columna: 'puerpera_aceptante', booleano: true },
    metodo_oral: { columna: 'metodo_oral' },
    metodo_inyectable_mensual: { columna: 'metodo_inyectable_mensual' },
    metodo_inyectable_bimestral: { columna: 'metodo_inyectable_bimestral' },
    metodo_inyectable_trimestral: { columna: 'metodo_inyectable_trimestral' },
    // 6. IMPLANTE SUBDÉRMICO: a) una varilla, b) doble varilla ->
    // la vista ya resuelve esto a la Clave corta (0=REVISIÓN,
    // 1=INSERCIÓN/REINSERCIÓN) vía el pivote por Inciso, así que aquí
    // es passthrough simple (no hace falta resolver_catalogo).
    implante_subdermico_a: { columna: 'implante_subdermico_a' },
    implante_subdermico_b: { columna: 'implante_subdermico_b' },
    metodo_parche_dermico: { columna: 'metodo_parche_dermico' },
    metodo_diu: { columna: 'metodo_diu' },
    metodo_diu_medicado: { columna: 'metodo_diu_medicado' },
    metodo_quirurgico: { columna: 'metodo_quirurgico' },
    metodo_preservativo: { columna: 'metodo_preservativo' },
    metodo_preservativo_femenino: { columna: 'metodo_preservativo_femenino' },
    metodo_otro: { columna: 'metodo_otro' },
    anticoncepcion_emergencia: { columna: 'anticoncepcion_emergencia', booleano: true },
    alta_azoospermia_vasectomia: { columna: 'alta_azoospermia_vasectomia', booleano: true },

    // --- Orientación - consejería ---
    orientacion_planificacion_familiar: { columna: 'orientacion_planificacion_familiar', booleano: true },
    orientacion_prevencion_its: { columna: 'orientacion_prevencion_its', booleano: true },
    orientacion_prevencion_embarazo: { columna: 'orientacion_prevencion_embarazo', booleano: true },
    // Confirmado: Orientacion_Consejeria.Otras_Atenciones_SSRA es BOOL.
    otras_atenciones_ssra: { columna: 'otras_atenciones_ssra', booleano: true },

    // --- Promoción de la salud (mismo mapeo que consulta externa) ---
    consulta_integrada_linea_vida: { columna: 'consulta_integrada_linea_vida', booleano: true },
    presenta_cartilla: { columna: 'presenta_cartilla', booleano: true },
    esquema_vacunacion: { columna: 'esquema_vacunacion_id', catalogo: 'esquema_vacunacion' },

    // --- Referencia, contrarreferencia y teleconsulta ---
    // `Consultas` no tiene columna booleana "Referido"; la vista la
    // infiere (1/0) de si hay Cat_Referido_Nivel_Id_Cat_Referido_Nivel.
    referido: { columna: 'referido', booleano: true },
    referido_nivel: { columna: 'referido_nivel' },
    // 9. ESPECIALIDAD = SERVICIO: la vista ya resuelve esto con el mismo
    // catálogo de "servicio" (join a Cat_Servicios vía
    // Cat_Servicio_Id_Cat_Especialidad), igual que en consulta externa.
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