'use strict';

const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const JSZip = require('jszip');
const RUTAS = require('../../config/rutas');
const U = require('../../utils/plantilla_xlsx');
const CONSULTA_EXTERNA_CONFIG = require('../../config/formatos/consulta_externa.config');
const PLANIFICACION_FAMILIAR_CONFIG = require('../../config/formatos/planificacion_familiar.config');
const SALUD_BUCAL_CONFIG = require('../../config/formatos/salud_bucal.config');
const DETECCIONES_CONFIG = require('../../config/formatos/detecciones.config');

// Formatos registrados. Para agregar otro basta con crear su archivo de
// configuración en ./formatos y registrarlo aquí.
const FORMATOS = {
    [CONSULTA_EXTERNA_CONFIG.id]: CONSULTA_EXTERNA_CONFIG,
    [PLANIFICACION_FAMILIAR_CONFIG.id]: PLANIFICACION_FAMILIAR_CONFIG,
    [SALUD_BUCAL_CONFIG.id]: SALUD_BUCAL_CONFIG,
    [DETECCIONES_CONFIG.id]: DETECCIONES_CONFIG,
};

// Límite de seguridad para evitar archivos enormes por un error de consulta.
const MAXIMO_HOJAS = 50;

const RELACION_HOJA =
    'http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet';
const TIPO_HOJA =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml';
const TIPO_DIBUJO =
    'application/vnd.openxmlformats-officedocument.drawing+xml';


// ---------------------------------------------------------------------------
// Validación de datos
// ---------------------------------------------------------------------------

function es_objeto_plano(valor) {
    return valor !== null && typeof valor === 'object' && !Array.isArray(valor);
}

function es_valor_escribible(valor) {
    return (
        (typeof valor === 'string') ||
        (typeof valor === 'number' && Number.isFinite(valor))
    );
}

function valor_vacio(valor) {
    return (
        valor === undefined ||
        valor === null ||
        (typeof valor === 'string' && !valor.trim())
    );
}

/**
 * Convierte la fecha recibida en día, mes y año con ceros a la izquierda.
 * Acepta 'AAAA-MM-DD' o un objeto Date.
 */
function separar_fecha(fecha) {
    if (fecha instanceof Date && !Number.isNaN(fecha.getTime())) {
        return {
            dia: String(fecha.getDate()).padStart(2, '0'),
            mes: String(fecha.getMonth() + 1).padStart(2, '0'),
            anio: String(fecha.getFullYear()),
        };
    }
    const coincidencia = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(fecha || ''));
    if (!coincidencia) {
        throw new Error('La fecha debe tener el formato AAAA-MM-DD.');
    }
    return { dia: coincidencia[3], mes: coincidencia[2], anio: coincidencia[1] };
}

/**
 * Valida los datos contra la configuración del formato.
 * Los campos vacíos se permiten (una consulta no llena toda la hoja), pero
 * los campos que no existen en el formato se rechazan para detectar errores
 * de escritura en el mapeo.
 */
function validar_datos(configuracion, datos) {
    if (!es_objeto_plano(datos)) {
        throw new Error('Los datos deben proporcionarse como un objeto.');
    }

    const { encabezado, registros } = datos;
    if (!es_objeto_plano(encabezado)) {
        throw new Error('Falta el encabezado de la hoja.');
    }
    if (!Array.isArray(registros) || registros.length === 0) {
        throw new Error('No hay consultas registradas para generar la hoja.');
    }

    const hojas_necesarias = Math.ceil(registros.length / configuracion.registros.maximo_por_hoja);
    if (hojas_necesarias > MAXIMO_HOJAS) {
        throw new Error(`Se excede el máximo de ${MAXIMO_HOJAS} hojas por archivo.`);
    }

    // Encabezado
    for (const [clave, valor] of Object.entries(encabezado)) {
        if (clave === 'fecha') {
            continue;
        }
        if (!configuracion.encabezado[clave]) {
            throw new Error(`El campo de encabezado "${clave}" no existe en el formato.`);
        }
        if (!valor_vacio(valor) && !es_valor_escribible(valor)) {
            throw new Error(`El valor del encabezado "${clave}" no es válido.`);
        }
    }
    separar_fecha(encabezado.fecha);

    // Consultas
    registros.forEach((registro, indice) => {
        if (!es_objeto_plano(registro)) {
            throw new Error(`La consulta ${indice + 1} no es un objeto válido.`);
        }
        for (const [clave, valor] of Object.entries(registro)) {
            if (!configuracion.registros.campos[clave]) {
                throw new Error(
                    `El campo "${clave}" de la consulta ${indice + 1} no existe en el formato.`
                );
            }
            if (!valor_vacio(valor) && !es_valor_escribible(valor)) {
                throw new Error(
                    `El valor de "${clave}" en la consulta ${indice + 1} no es válido.`
                );
            }
        }
    });
}


// ---------------------------------------------------------------------------
// Llenado de una hoja
// ---------------------------------------------------------------------------

/**
 * Escribe el encabezado, la fecha y hasta 5 consultas en el XML de una hoja.
 */
function rellenar_hoja(xml_base, configuracion, contexto, encabezado, registros_hoja) {
    const { cadenas, estilos } = contexto;
    let xml = xml_base;

    // Valores simples centrados o ajustados a la celda para que no se corten.
    const estilo_ajustado = (xml_actual, referencia) => {
        const celda = U.buscar_celda(xml_actual, referencia);
        const base = celda ? U.obtener_estilo_celda(celda[1]) : 0;
        return estilos.clonar(base, { shrinkToFit: '1' });
    };

    // Encabezado (CLUES, unidad, prestador, tipo de personal, cédula).
    // La mayoría de las celdas son un valor suelto, pero algunas (p. ej.
    // nombre_prestador) ya traen una etiqueta impresa en la plantilla que
    // debe conservarse junto al valor, igual que en los campos de registros
    // marcados con "titulo": configuracion.encabezado[clave] puede ser un
    // string (celda) o un objeto { celda, titulo: true }.
    for (const [clave, valor] of Object.entries(encabezado)) {
        if (clave === 'fecha' || valor_vacio(valor)) {
            continue;
        }
        const campo_encabezado = configuracion.encabezado[clave];
        const referencia = typeof campo_encabezado === 'string'
            ? campo_encabezado
            : campo_encabezado.celda;

        if (typeof campo_encabezado === 'object' && campo_encabezado.titulo) {
            const celda = U.buscar_celda(xml, referencia);
            if (!celda) {
                throw new Error(`La celda ${referencia} (${clave}) no existe en la plantilla.`);
            }
            const estilo_actual = U.obtener_estilo_celda(celda[1]);
            const etiqueta = U.leer_texto_celda(xml, referencia, cadenas);
            xml = U.escribir_celda(xml, referencia, valor, {
                titulo: etiqueta,
                // Solo "wrapText": "shrinkToFit" obliga a Excel a encoger la
                // letra para que etiqueta y valor entren en una sola línea,
                // lo que anula el salto de línea ("\n") que escribir_celda
                // ya pone entre ambos y hace que el valor nunca baje de
                // renglón (ver el mismo patrón, sin shrinkToFit, abajo en
                // el bucle de "registros").
                estilo: estilos.clonar(estilo_actual, { wrapText: '1' }),
                tam: 9,
            });
        } else {
            xml = U.escribir_celda(xml, referencia, valor, {
                estilo: estilo_ajustado(xml, referencia),
                tam: 9,
            });
        }
    }

    // Fecha: tres recuadros (día, mes, año) en la parte superior derecha.
    const { fecha: cfg_fecha } = configuracion;
    const partes = separar_fecha(encabezado.fecha);
    for (const parte of ['dia', 'mes', 'anio']) {
        const [desde, hasta] = cfg_fecha[parte].rango;
        const estilo = estilos.clonar(cfg_fecha.estilo_base, {
            horizontal: 'center',
            vertical: 'center',
            shrinkToFit: '1',
        });
        xml = U.escribir_celda(xml, `${desde}${cfg_fecha.fila}`, partes[parte], { estilo, tam: 10 });
        xml = U.agregar_combinacion(xml, `${desde}${cfg_fecha.fila}:${hasta}${cfg_fecha.fila}`);
    }

    // Consultas
    const { fila_inicial, altura_bloque, campos } = configuracion.registros;
    registros_hoja.forEach((registro, indice) => {
        for (const [clave, valor] of Object.entries(registro)) {
            const { col, fila, titulo, desborda, centrado, limpiar_si_vacio } = campos[clave];
            if (valor_vacio(valor)) {
                if (!limpiar_si_vacio) {
                    continue;
                }
                // Algunas plantillas oficiales traen el numerito de la
                // pregunta del instructivo impreso dentro de la propia
                // celda de datos (no solo en la fila de leyenda). No se
                // modifica la plantilla: aquí se sobrescribe esa celda con
                // un valor vacío únicamente en el archivo generado, para
                // que no se confunda con un dato capturado.
                const referencia_vacia = `${col}${fila_inicial + indice * altura_bloque + fila}`;
                const celda_vacia = U.buscar_celda(xml, referencia_vacia);
                if (celda_vacia) {
                    const estilo_vacio = U.obtener_estilo_celda(celda_vacia[1]);
                    xml = U.escribir_celda(xml, referencia_vacia, '', { estilo: estilo_vacio });
                }
                continue;
            }
            const referencia = `${col}${fila_inicial + indice * altura_bloque + fila}`;
            const celda = U.buscar_celda(xml, referencia);
            if (!celda) {
                throw new Error(`La celda ${referencia} (${clave}) no existe en la plantilla.`);
            }
            const estilo_actual = U.obtener_estilo_celda(celda[1]);

            if (titulo) {
                // Conservar la etiqueta impresa (Peso, Talla, a, b, 25...).
                const etiqueta = U.leer_texto_celda(xml, referencia, cadenas);
                xml = U.escribir_celda(xml, referencia, valor, {
                    titulo: etiqueta,
                    estilo: estilos.clonar(estilo_actual, { wrapText: '1' }),
                });
            } else {
                // Los campos marcados con "desborda" se extienden sobre las
                // celdas vecinas vacías; los demás se ajustan a su celda
                // (y se centran si llevan "centrado").
                xml = U.escribir_celda(xml, referencia, valor, {
                    estilo: desborda
                        ? estilo_actual
                        : estilos.clonar(
                            estilo_actual,
                            centrado
                                ? { horizontal: 'center', shrinkToFit: '1' }
                                : { shrinkToFit: '1' }
                        ),
                });
            }
        }
    });

    return xml;
}


// ---------------------------------------------------------------------------
// Paquete XLSX
// ---------------------------------------------------------------------------

async function leer_texto(zip, ruta) {
    const archivo = zip.file(ruta);
    if (!archivo) {
        throw new Error(`La plantilla no contiene "${ruta}".`);
    }
    return archivo.async('string');
}

/** Resuelve la ruta interna de la hoja indicada (por nombre). */
async function resolver_hoja(zip, nombre_hoja) {
    const libro = await leer_texto(zip, 'xl/workbook.xml');
    const relaciones = await leer_texto(zip, 'xl/_rels/workbook.xml.rels');

    const hoja = [...libro.matchAll(/<sheet\b[^>]*>/g)]
        .map((m) => m[0])
        .find((etiqueta) => /\bname="([^"]*)"/.exec(etiqueta)?.[1] === nombre_hoja);
    if (!hoja) {
        throw new Error(`No existe la hoja "${nombre_hoja}" en la plantilla.`);
    }
    const id_relacion = /\br:id="([^"]+)"/.exec(hoja)[1];
    const relacion = [...relaciones.matchAll(/<Relationship\b[^>]*>/g)]
        .map((m) => m[0])
        .find((etiqueta) => new RegExp(`\\bId="${id_relacion}"`).test(etiqueta));
    const destino = /\bTarget="([^"]+)"/.exec(relacion)[1];
    return path.posix.normalize(path.posix.join('xl', destino));
}

/** Deja la hoja abierta en A1 y con una sola pestaña seleccionada. */
function normalizar_vista(xml, seleccionada) {
    let resultado = xml
        .replace(/\s+topLeftCell="[^"]*"/, '')
        .replace(/<selection\b[^>]*\/>/, '<selection activeCell="A1" sqref="A1"/>');
    if (!seleccionada) {
        resultado = resultado.replace(/\s+tabSelected="1"/, '');
    }
    return resultado;
}

/**
 * Genera un XLSX a partir de la plantilla con una hoja por cada 5 consultas.
 * Las hojas adicionales son copias completas de la primera (incluido su
 * dibujo con las leyendas) para que todas se impriman igual.
 */
async function construir_libro(ruta_plantilla, configuracion, datos) {
    const zip = await JSZip.loadAsync(await fs.readFile(ruta_plantilla));

    const ruta_hoja = await resolver_hoja(zip, configuracion.hoja);
    const ruta_rels_hoja = path.posix.join(
        path.posix.dirname(ruta_hoja), '_rels', `${path.posix.basename(ruta_hoja)}.rels`
    );
    const xml_hoja_base = await leer_texto(zip, ruta_hoja);

    const contexto = {
        cadenas: U.leer_cadenas_compartidas(await leer_texto(zip, 'xl/sharedStrings.xml')),
        estilos: U.crear_gestor_estilos(await leer_texto(zip, 'xl/styles.xml')),
    };

    // Dividir las consultas en hojas de 5.
    const { maximo_por_hoja } = configuracion.registros;
    const grupos = [];
    for (let i = 0; i < datos.registros.length; i += maximo_por_hoja) {
        grupos.push(datos.registros.slice(i, i + maximo_por_hoja));
    }

    let libro = await leer_texto(zip, 'xl/workbook.xml');
    let relaciones_libro = await leer_texto(zip, 'xl/_rels/workbook.xml.rels');
    let tipos_contenido = await leer_texto(zip, '[Content_Types].xml');
    const rels_hoja_base = zip.file(ruta_rels_hoja)
        ? await leer_texto(zip, ruta_rels_hoja)
        : null;

    const area_impresion = new RegExp(
        `<definedName name="_xlnm\\.Print_Area" localSheetId="0">([\\s\\S]*?)</definedName>`
    ).exec(libro);
    let id_hoja_maximo = Math.max(
        ...[...libro.matchAll(/<sheet\b[^>]*\bsheetId="(\d+)"/g)].map((m) => Number(m[1]))
    );

    for (let numero = 0; numero < grupos.length; numero += 1) {
        const xml_relleno = normalizar_vista(
            rellenar_hoja(xml_hoja_base, configuracion, contexto, datos.encabezado, grupos[numero]),
            numero === 0
        );

        if (numero === 0) {
            zip.file(ruta_hoja, xml_relleno);
            continue;
        }

        // Hojas adicionales: copiar hoja, dibujo y configuración de impresión.
        const sufijo = `_pag${numero + 1}`;
        const nombre_hoja = `${configuracion.hoja} (${numero + 1})`;
        const ruta_nueva = ruta_hoja.replace(/\.xml$/, `${sufijo}.xml`);
        zip.file(ruta_nueva, xml_relleno);

        if (rels_hoja_base) {
            let rels_nuevo = rels_hoja_base;
            for (const relacion of rels_hoja_base.matchAll(/<Relationship\b[^>]*>/g)) {
                const destino = /\bTarget="([^"]+)"/.exec(relacion[0])[1];
                const ruta_origen = path.posix.normalize(
                    path.posix.join(path.posix.dirname(ruta_hoja), destino)
                );
                const extension = path.posix.extname(ruta_origen);
                const ruta_copia = ruta_origen.replace(
                    new RegExp(`${extension.replace('.', '\\.')}$`), `${sufijo}${extension}`
                );
                zip.file(ruta_copia, await zip.file(ruta_origen).async('nodebuffer'));
                rels_nuevo = rels_nuevo.replace(
                    `Target="${destino}"`,
                    `Target="${path.posix.relative(path.posix.dirname(ruta_nueva), ruta_copia)}"`
                );

                // El dibujo tiene sus propias relaciones (imágenes).
                const ruta_rels_origen = path.posix.join(
                    path.posix.dirname(ruta_origen), '_rels', `${path.posix.basename(ruta_origen)}.rels`
                );
                if (zip.file(ruta_rels_origen)) {
                    const ruta_rels_copia = path.posix.join(
                        path.posix.dirname(ruta_copia), '_rels', `${path.posix.basename(ruta_copia)}.rels`
                    );
                    zip.file(ruta_rels_copia, await zip.file(ruta_rels_origen).async('nodebuffer'));
                }
                if (/\.xml$/.test(ruta_copia) && /drawing/.test(ruta_copia)) {
                    tipos_contenido = tipos_contenido.replace(
                        '</Types>',
                        `<Override PartName="/${ruta_copia}" ContentType="${TIPO_DIBUJO}"/></Types>`
                    );
                }
            }
            zip.file(
                path.posix.join(path.posix.dirname(ruta_nueva), '_rels', `${path.posix.basename(ruta_nueva)}.rels`),
                rels_nuevo
            );
        }

        id_hoja_maximo += 1;
        const id_relacion = `rIdPag${numero + 1}`;
        libro = libro.replace(
            '</sheets>',
            `<sheet name="${U.escapar_xml(nombre_hoja)}" sheetId="${id_hoja_maximo}" r:id="${id_relacion}"/></sheets>`
        );
        if (area_impresion) {
            const area = area_impresion[1].replace(
                `'${configuracion.hoja}'`, `'${nombre_hoja}'`
            );
            libro = libro.replace(
                '</definedNames>',
                `<definedName name="_xlnm.Print_Area" localSheetId="${numero}">${area}</definedName></definedNames>`
            );
        }
        relaciones_libro = relaciones_libro.replace(
            '</Relationships>',
            `<Relationship Id="${id_relacion}" Type="${RELACION_HOJA}" ` +
            `Target="${path.posix.relative('xl', ruta_nueva)}"/></Relationships>`
        );
        tipos_contenido = tipos_contenido.replace(
            '</Types>',
            `<Override PartName="/${ruta_nueva}" ContentType="${TIPO_HOJA}"/></Types>`
        );
    }

    zip.file('xl/styles.xml', contexto.estilos.serializar());
    zip.file('xl/workbook.xml', libro);
    zip.file('xl/_rels/workbook.xml.rels', relaciones_libro);
    zip.file('[Content_Types].xml', tipos_contenido);

    return {
        contenido: await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }),
        hojas: grupos.length,
    };
}


// ---------------------------------------------------------------------------
// Servicio
// ---------------------------------------------------------------------------

/**
 * Genera un archivo XLSX del formato indicado con los datos recibidos.
 *
 * @param {string} id_formato - Identificador del formato registrado.
 * @param {object} datos
 * @param {object} datos.encabezado - CLUES, unidad, prestador, tipo de personal,
 *   cédula y fecha (AAAA-MM-DD).
 * @param {object[]} datos.registros - Consultas del día (5 por hoja).
 * @returns {Promise<object>} Información del archivo generado.
 */
async function generar_xls(id_formato, datos) {
    try {
        // Validar el formato solicitado
        if (typeof id_formato !== 'string' || !id_formato.trim()) {
            throw new Error('Debe especificar un formato válido.');
        }
        const configuracion = FORMATOS[id_formato];
        if (!configuracion) {
            throw new Error(`El formato "${id_formato}" no está registrado.`);
        }

        validar_datos(configuracion, datos);

        // Obtener y validar la ruta de la plantilla
        const ruta_plantilla = path.join(RUTAS.formatos_excel, configuracion.plantilla);
        const ruta_real_plantilla = await fs.realpath(ruta_plantilla);
        const ruta_real_formatos = await fs.realpath(RUTAS.formatos_excel);
        // Evitar que una configuración apunte fuera de la carpeta de plantillas
        const ruta_relativa = path.relative(ruta_real_formatos, ruta_real_plantilla);

        if (
            ruta_relativa === '..' ||
            ruta_relativa.startsWith(`..${path.sep}`) ||
            path.isAbsolute(ruta_relativa)
        ) {
            throw new Error('La plantilla se encuentra fuera del directorio autorizado.');
        }
        const informacion_plantilla = await fs.stat(ruta_real_plantilla);
        if (!informacion_plantilla.isFile()) {
            throw new Error('La plantilla indicada no es un archivo válido.');
        }

        // Construir el libro (una hoja por cada 5 consultas)
        const { contenido, hojas } = await construir_libro(ruta_real_plantilla, configuracion, datos);

        // Guardar con un nombre único
        await fs.mkdir(RUTAS.temporales_excel, { recursive: true });
        const nombre_archivo = `${configuracion.id}_${randomUUID()}.xlsx`;
        const ruta_salida = path.join(RUTAS.temporales_excel, nombre_archivo);
        await fs.writeFile(ruta_salida, contenido);

        return {
            mensaje: 'Archivo XLSX generado correctamente.',
            formato: configuracion.id,
            nombre_archivo,
            ruta_archivo: ruta_salida,
            consultas: datos.registros.length,
            hojas,
        };
    } catch (error) {
        // Registrar el error técnico sin incluir datos clínicos
        console.error('[generar_xls]', error.message);
        throw new Error(`No fue posible generar el XLSX: ${error.message}`);
    }
}

module.exports = { generar_xls };