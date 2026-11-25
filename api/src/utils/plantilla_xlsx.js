'use strict';

/**
 * Utilidades para rellenar una plantilla XLSX editando directamente su XML.
 *
 * Se evita cargar y guardar el libro con ExcelJS porque ExcelJS descarta las
 * formas (cuadros de texto, grupos y leyendas) del dibujo de la hoja. Los
 * formatos SINBA llevan en esas formas los catálogos de claves y el recuadro
 * de la fecha, así que se perderían al exportar.
 *
 * Aquí solo se modifican celdas, estilos y combinaciones de celdas; el resto
 * del paquete (dibujos, imágenes, configuración de impresión) queda intacto.
 *
 * Nota: los atributos/etiquetas XML (s, t, v, r, rPr, sz, rFont, wrapText,
 * shrinkToFit, applyAlignment, mergeCells, etc.) pertenecen al estándar
 * OOXML y se dejan tal cual; solo se renombran los identificadores propios
 * de este archivo.
 */

// ---------------------------------------------------------------------------
// Referencias de celda
// ---------------------------------------------------------------------------

/** 'AB' -> 28 */
function columna_a_numero(letras) {
    let numero = 0;
    for (const caracter of letras) {
        numero = numero * 26 + (caracter.charCodeAt(0) - 64);
    }
    return numero;
}

/** 'AB14' -> { columna: 'AB', fila: 14, numero_columna: 28 } */
function separar_referencia(referencia) {
    const coincidencia = /^([A-Z]{1,3})(\d{1,5})$/.exec(referencia);
    if (!coincidencia) {
        throw new Error(`Referencia de celda no válida: "${referencia}".`);
    }
    return {
        columna: coincidencia[1],
        fila: Number(coincidencia[2]),
        numero_columna: columna_a_numero(coincidencia[1]),
    };
}

// ---------------------------------------------------------------------------
// Texto XML
// ---------------------------------------------------------------------------

function escapar_xml(texto) {
    return String(texto)
        // Caracteres de control que vuelven inválido el XML (se conserva \n).
        .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function desescapar_xml(texto) {
    return texto
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
        .replace(/&amp;/g, '&');
}

/** Lee la tabla de cadenas compartidas del libro. */
function leer_cadenas_compartidas(xml) {
    const cadenas = [];
    for (const bloque of xml.matchAll(/<si>([\s\S]*?)<\/si>/g)) {
        const texto = [...bloque[1].matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)]
            .map((parte) => parte[1])
            .join('');
        cadenas.push(desescapar_xml(texto));
    }
    return cadenas;
}

// ---------------------------------------------------------------------------
// Estilos
// ---------------------------------------------------------------------------

/**
 * Crea un gestor que clona estilos de celda (cellXfs) con otra alineación.
 * Cada combinación se crea una sola vez.
 */
function crear_gestor_estilos(xml_estilos) {
    const bloque = /<cellXfs count="\d+">([\s\S]*?)<\/cellXfs>/.exec(xml_estilos);
    if (!bloque) {
        throw new Error('La plantilla no contiene la tabla de estilos esperada.');
    }
    const estilos = [...bloque[1].matchAll(/<xf\b[^>]*?(?:\/>|>[\s\S]*?<\/xf>)/g)]
        .map((coincidencia) => coincidencia[0]);
    const cache = new Map();

    function clonar(indice_base, alineacion) {
        const clave = `${indice_base}|${JSON.stringify(alineacion)}`;
        if (cache.has(clave)) {
            return cache.get(clave);
        }
        const base = estilos[indice_base];
        if (!base) {
            throw new Error(`No existe el estilo ${indice_base} en la plantilla.`);
        }

        // Atributos de alineación actuales (si los hay).
        const actual = {};
        const etiqueta_alineacion = /<alignment\b([^>]*?)\/?>/.exec(base);
        if (etiqueta_alineacion) {
            for (const atributo of etiqueta_alineacion[1].matchAll(/(\w+)="([^"]*)"/g)) {
                actual[atributo[1]] = atributo[2];
            }
        }
        const nueva = { ...actual, ...alineacion };
        // wrapText y shrinkToFit son excluyentes (nombres de atributo OOXML).
        if (alineacion.shrinkToFit) {
            delete nueva.wrapText;
        }
        if (alineacion.wrapText) {
            delete nueva.shrinkToFit;
        }
        const atributos = Object.entries(nueva)
            .map(([nombre, valor]) => `${nombre}="${valor}"`)
            .join(' ');
        const etiqueta_nueva = `<alignment ${atributos}/>`;

        // Quitar la alineación anterior y reinsertar la nueva.
        let apertura = /^<xf\b[^>]*?(?=\/?>)/.exec(base)[0];
        if (!/applyAlignment=/.test(apertura)) {
            apertura += ' applyAlignment="1"';
        }
        const contenido_interno = (/^<xf\b[^>]*?>([\s\S]*)<\/xf>$/.exec(base) || [null, ''])[1]
            .replace(/<alignment\b[^>]*?\/>/, '');
        const xf = `${apertura}>${etiqueta_nueva}${contenido_interno}</xf>`;

        estilos.push(xf);
        const indice = estilos.length - 1;
        cache.set(clave, indice);
        return indice;
    }

    function serializar() {
        return xml_estilos.replace(
            /<cellXfs count="\d+">[\s\S]*?<\/cellXfs>/,
            () => `<cellXfs count="${estilos.length}">${estilos.join('')}</cellXfs>`
        );
    }

    return { clonar, serializar };
}

// ---------------------------------------------------------------------------
// Celdas
// ---------------------------------------------------------------------------

function buscar_celda(xml_hoja, referencia) {
    return new RegExp(`<c r="${referencia}"([^>]*?)(/>|>[\\s\\S]*?</c>)`).exec(xml_hoja);
}

function obtener_estilo_celda(atributos) {
    const coincidencia = /\bs="(\d+)"/.exec(atributos);
    return coincidencia ? Number(coincidencia[1]) : 0;
}

/**
 * Devuelve el texto actual de una celda (cadena compartida, en línea o número).
 */
function leer_texto_celda(xml_hoja, referencia, cadenas_compartidas) {
    const celda = buscar_celda(xml_hoja, referencia);
    if (!celda) {
        return '';
    }
    const cuerpo = celda[2];
    if (/\bt="s"/.test(celda[1])) {
        const indice = /<v>(\d+)<\/v>/.exec(cuerpo);
        return indice ? (cadenas_compartidas[Number(indice[1])] || '') : '';
    }
    if (/\bt="inlineStr"/.test(celda[1])) {
        return desescapar_xml(
            [...cuerpo.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((p) => p[1]).join('')
        );
    }
    // Celda numérica (sin atributo t, o t="n"): el valor crudo <v> es la etiqueta.
    const valor_numerico = /<v>([^<]*)<\/v>/.exec(cuerpo);
    return valor_numerico ? valor_numerico[1] : '';
}

/**
 * Escribe un valor en una celda existente (o la crea dentro de su fila).
 *
 * @param {string} xml_hoja
 * @param {string} referencia - Ej. 'M14'.
 * @param {string|number} valor
 * @param {object} [opciones]
 * @param {number} [opciones.estilo] - Índice de estilo a usar en lugar del actual.
 * @param {string} [opciones.titulo] - Texto de etiqueta que se conserva antes del valor.
 * @param {number} [opciones.estilo_base] - Estilo para celdas que no existen.
 */
function escribir_celda(xml_hoja, referencia, valor, opciones = {}) {
    const existente = buscar_celda(xml_hoja, referencia);
    const estilo = opciones.estilo !== undefined
        ? opciones.estilo
        : existente
            ? obtener_estilo_celda(existente[1])
            : opciones.estilo_base || 0;
    const atributo_estilo = estilo ? ` s="${estilo}"` : '';

    // Los estilos de la plantilla usan letra pequeña y gris porque son
    // indicaciones de llenado; el valor capturado se escribe con su propia
    // fuente (negrita, negro) para que sea legible al imprimir.
    const tamano = opciones.tam || 6;
    const propiedades_valor =
        `<rPr><b/><sz val="${tamano}"/><color rgb="FF000000"/><rFont val="Arial"/></rPr>`;
    let celda_nueva;
    if (typeof valor === 'number' && !opciones.titulo) {
        // Celda numérica real (sin atributo "t", valor plano en <v>): así
        // Excel la reconoce como número y no marca la advertencia de
        // "número guardado como texto". A diferencia del texto, aquí no se
        // puede forzar la fuente por valor (<rPr>); toma la que traiga el
        // estilo de la celda.
        celda_nueva = `<c r="${referencia}"${atributo_estilo}><v>${valor}</v></c>`;
    } else {
        // Etiqueta pequeña y gris (si la celda la trae) + valor destacado.
        const etiqueta = opciones.titulo
            ? '<r><rPr><sz val="5"/><color rgb="FF7F7F7F"/><rFont val="Arial"/></rPr>' +
              `<t xml:space="preserve">${escapar_xml(opciones.titulo)}\n</t></r>`
            : '';
        celda_nueva = `<c r="${referencia}"${atributo_estilo} t="inlineStr"><is>${etiqueta}` +
            `<r>${propiedades_valor}<t xml:space="preserve">${escapar_xml(valor)}</t></r>` +
            '</is></c>';
    }

    if (existente) {
        return xml_hoja.replace(existente[0], () => celda_nueva);
    }

    // La celda no existe: insertarla en su fila respetando el orden de columnas.
    const { fila, numero_columna } = separar_referencia(referencia);
    const fila_xml = new RegExp(`(<row r="${fila}"[^>]*>)([\\s\\S]*?)(</row>)`).exec(xml_hoja);
    if (!fila_xml) {
        throw new Error(`La fila ${fila} no existe en la plantilla (${referencia}).`);
    }
    let cuerpo = fila_xml[2];
    let insertado = false;
    cuerpo = cuerpo.replace(/<c r="([A-Z]+)\d+"/g, (coincidencia, columna) => {
        if (!insertado && columna_a_numero(columna) > numero_columna) {
            insertado = true;
            return `${celda_nueva}${coincidencia}`;
        }
        return coincidencia;
    });
    if (!insertado) {
        cuerpo += celda_nueva;
    }
    return xml_hoja.replace(fila_xml[0], () => `${fila_xml[1]}${cuerpo}${fila_xml[3]}`);
}

/** Agrega una combinación de celdas a la hoja. */
function agregar_combinacion(xml_hoja, rango) {
    const bloque = /<mergeCells count="(\d+)">/.exec(xml_hoja);
    if (!bloque) {
        throw new Error('La plantilla no contiene combinaciones de celdas.');
    }
    return xml_hoja
        .replace(bloque[0], `<mergeCells count="${Number(bloque[1]) + 1}">`)
        .replace('</mergeCells>', `<mergeCell ref="${rango}"/></mergeCells>`);
}

module.exports = {
    separar_referencia,
    buscar_celda,
    obtener_estilo_celda,
    escapar_xml,
    leer_cadenas_compartidas,
    crear_gestor_estilos,
    leer_texto_celda,
    escribir_celda,
    agregar_combinacion,
};