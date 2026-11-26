'use strict';

/**
 * Generador del XLSX del Informe Mensual (una hoja por módulo, igual que
 * se decidió con Ileana: se genera un archivo por módulo+mes+año, no las
 * 4 hojas juntas).
 *
 * Mismo mecanismo que generar_xls_bitacora.service.js: no hay una
 * plantilla oficial que abrir (como sí la hay para consulta_externa,
 * salud_bucal, planificacion_familiar y detecciones), así que el XLSX se
 * arma desde cero con XML crudo + JSZip, reutilizando los mismos logos
 * (LOGO_IZQUIERDO / LOGO_DERECHO) ya usados en bitácora.
 *
 * Las filas (secciones/subsecciones/variables) vienen de
 * informe_mensual.filas.js. Los TOTALES (un número por `clave`) deben
 * venir ya calculados desde el modelo/servicio de SQL correspondiente —
 * este archivo solo dibuja la hoja, no calcula nada.
 */

const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const JSZip = require('jszip');
const RUTAS = require('../../config/rutas');
const { escapar_xml } = require('../../utils/plantilla_xlsx');
const { MODULOS } = require('./informe_mensual.filas');

const LOGO_IZQUIERDO = 'Logo_SIGSS.jpeg';
const LOGO_DERECHO = 'SSD_Servicios_Durango_Azul.jpeg';

// Alto de fila 1 en puntos y tamaño de los logos (en EMU: 1 px = 9525 EMU).
const ALTO_LOGO_PX = 42;
const PX_A_EMU = 9525;

function celda_texto(referencia, valor, estilo) {
    return `<c r="${referencia}" s="${estilo}" t="inlineStr"><is><t xml:space="preserve">${escapar_xml(valor ?? '')}</t></is></c>`;
}

function celda_numero(referencia, valor, estilo) {
    if (valor === undefined || valor === null || valor === '') {
        return `<c r="${referencia}" s="${estilo}"/>`;
    }
    return `<c r="${referencia}" s="${estilo}"><v>${Number(valor)}</v></c>`;
}

function celda_vacia(referencia, estilo) {
    return `<c r="${referencia}" s="${estilo}"/>`;
}

/**
 * Construye el XML de la hoja de un módulo.
 *
 * @param {Array} filas         Definición de informe_mensual.filas.js (una por módulo).
 * @param {Object} valores      Mapa { clave: número } con los totales ya calculados.
 * @param {Object} metadatos    { nombre_unidad, clues, servicio, responsable, mes, anio }
 * @param {string} titulo_modulo
 */
function construir_hoja(filas, valores, metadatos, titulo_modulo) {
    const filas_xml = [];
    const combinaciones = [];

    // --- Fila 1: título + logos (los logos van en el <drawing>, no aquí) ---
    filas_xml.push(
        `<row r="1" ht="32" customHeight="1">` +
        celda_texto('A1', 'INFORME MENSUAL DE ACTIVIDADES', 2) +
        celda_vacia('B1', 2) +
        `</row>`
    );
    combinaciones.push('A1:B1');

    // --- Fila 2: módulo ---
    filas_xml.push(`<row r="2">${celda_texto('A2', `Módulo: ${titulo_modulo}`, 4)}${celda_vacia('B2', 0)}</row>`);
    combinaciones.push('A2:B2');

    // --- Filas 3-8: datos de identificación (etiqueta en A, valor en B) ---
    const campos_identificacion = [
        ['Nombre de la unidad:', metadatos.nombre_unidad],
        ['CLUES:', metadatos.clues],
        ['Servicio:', metadatos.servicio],
        ['Nombre de la persona responsable:', metadatos.responsable],
        ['Mes:', metadatos.mes],
        ['Año:', metadatos.anio],
    ];
    campos_identificacion.forEach(([etiqueta, valor], indice) => {
        const fila = indice + 3;
        filas_xml.push(
            `<row r="${fila}">` +
            celda_texto(`A${fila}`, etiqueta, 5) +
            celda_texto(`B${fila}`, valor, 6) +
            `</row>`
        );
    });

    // --- Fila 9: separador ---
    filas_xml.push(`<row r="9">${celda_vacia('A9', 0)}${celda_vacia('B9', 0)}</row>`);

    // --- Fila 10: encabezado de tabla ---
    filas_xml.push(`<row r="10">${celda_texto('A10', 'Variable', 7)}${celda_texto('B10', 'Total', 7)}</row>`);

    // --- Filas 11+: secciones / subsecciones / variables ---
    let fila_actual = 11;
    for (const definicion of filas) {
        if (definicion.tipo === 'seccion') {
            filas_xml.push(`<row r="${fila_actual}">${celda_texto(`A${fila_actual}`, definicion.texto, 8)}${celda_vacia(`B${fila_actual}`, 8)}</row>`);
            combinaciones.push(`A${fila_actual}:B${fila_actual}`);
        } else if (definicion.tipo === 'subseccion') {
            filas_xml.push(`<row r="${fila_actual}">${celda_texto(`A${fila_actual}`, definicion.texto, 9)}${celda_vacia(`B${fila_actual}`, 9)}</row>`);
            combinaciones.push(`A${fila_actual}:B${fila_actual}`);
        } else {
            const valor = valores ? valores[definicion.clave] : undefined;
            filas_xml.push(
                `<row r="${fila_actual}">` +
                celda_texto(`A${fila_actual}`, `    ${definicion.texto}`, 10) +
                celda_numero(`B${fila_actual}`, valor, 11) +
                `</row>`
            );
        }
        fila_actual += 1;
    }

    const ultima_fila = fila_actual - 1;

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>
<dimension ref="A1:B${ultima_fila}"/>
<sheetViews>
<sheetView workbookViewId="0">
<pane ySplit="10" topLeftCell="A11" activePane="bottomLeft" state="frozen"/>
<selection pane="bottomLeft" activeCell="A11" sqref="A11"/>
</sheetView>
</sheetViews>
<cols>
<col min="1" max="1" width="52"/>
<col min="2" max="2" width="16"/>
<col min="3" max="3" width="2"/>
<col min="4" max="5" width="11"/>
</cols>
<sheetData>${filas_xml.join('')}</sheetData>
<mergeCells count="${combinaciones.length}">${combinaciones.map((ref) => `<mergeCell ref="${ref}"/>`).join('')}</mergeCells>
<pageMargins left="0.5" right="0.5" top="0.6" bottom="0.6" header="0.3" footer="0.3"/>
<pageSetup paperSize="1" orientation="portrait" fitToWidth="1" fitToHeight="0"/>
<headerFooter>
<oddHeader>&amp;CINFORME MENSUAL DE ACTIVIDADES</oddHeader>
<oddFooter>&amp;CPágina &amp;P de &amp;N</oddFooter>
</headerFooter>
<drawing r:id="rIdDrawing"/>
</worksheet>`;
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="jpg" ContentType="image/jpeg"/>
<Default Extension="jpeg" ContentType="image/jpeg"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>
</Types>`;

const RELS_RAIZ = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

function construir_workbook(nombre_hoja) {
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="${nombre_hoja}" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;
}

const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

const SHEET_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rIdDrawing" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing" Target="../drawings/drawing1.xml"/>
</Relationships>`;

const DRAWING_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image1.jpg"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="../media/image2.jpg"/>
</Relationships>`;

function construir_drawing(ancho_logo_izq_px, ancho_logo_der_px) {
    const cy = ALTO_LOGO_PX * PX_A_EMU;
    const cx_izq = Math.round(ancho_logo_izq_px * PX_A_EMU);
    const cx_der = Math.round(ancho_logo_der_px * PX_A_EMU);
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<xdr:oneCellAnchor>
<xdr:from><xdr:col>3</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from>
<xdr:ext cx="${cx_izq}" cy="${cy}"/>
<xdr:pic>
<xdr:nvPicPr><xdr:cNvPr id="1" name="Logo SIGSS"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr>
<xdr:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>
<xdr:spPr><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr>
</xdr:pic>
<xdr:clientData/>
</xdr:oneCellAnchor>
<xdr:oneCellAnchor>
<xdr:from><xdr:col>4</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from>
<xdr:ext cx="${cx_der}" cy="${cy}"/>
<xdr:pic>
<xdr:nvPicPr><xdr:cNvPr id="2" name="Logo Servicios de Salud Durango"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr>
<xdr:blipFill><a:blip r:embed="rId2"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>
<xdr:spPr><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr>
</xdr:pic>
<xdr:clientData/>
</xdr:oneCellAnchor>
</xdr:wsDr>`;
}

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="7">
<font><sz val="11"/><name val="Calibri"/></font>
<font><sz val="10"/><name val="Arial"/></font>
<font><b/><sz val="13"/><color rgb="FFFFFFFF"/><name val="Arial"/></font>
<font><b/><i/><sz val="11"/><name val="Arial"/></font>
<font><b/><sz val="10"/><name val="Arial"/></font>
<font><b/><sz val="10"/><color rgb="FF000000"/><name val="Arial"/></font>
<font><b/><i/><sz val="10"/><name val="Arial"/></font>
</fonts>
<fills count="6">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FF1F4E78"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFFFFF00"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFBDD7EE"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFDDEBF7"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color indexed="64"/></left><right style="thin"><color indexed="64"/></right><top style="thin"><color indexed="64"/></top><bottom style="thin"><color indexed="64"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="12">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="2" fillId="1" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>
<xf numFmtId="0" fontId="3" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="4" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="0" fontId="5" fillId="3" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="5" fillId="4" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="0" fontId="6" fillId="5" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center"/></xf>
</cellXfs>
</styleSheet>`;

/**
 * @param {string} modulo_id   Una de las llaves de MODULOS ('planificacion_familiar', 'detecciones', 'salud_bucal', 'consulta_externa').
 * @param {Object} valores     Mapa { clave: número } con los totales ya calculados para ese módulo+mes+año+unidad.
 * @param {Object} metadatos   { nombre_unidad, clues, servicio, responsable, mes, anio }
 */
async function generar_xls_informe_mensual(modulo_id, valores, metadatos = {}) {
    const modulo = MODULOS[modulo_id];
    if (!modulo) {
        throw new Error(`Módulo de informe mensual no reconocido: ${modulo_id}`);
    }

    const ruta_logo_izq = path.join(RUTAS.imagenes, LOGO_IZQUIERDO);
    const ruta_logo_der = path.join(RUTAS.imagenes, LOGO_DERECHO);
    const [logo_izq, logo_der] = await Promise.all([
        fs.readFile(ruta_logo_izq),
        fs.readFile(ruta_logo_der),
    ]);

    // Las dimensiones reales del logo ya están fijas en el proyecto
    // (mismos archivos que usa Bitácora): SIGSS 80x106, SSD 95x125.
    const ancho_logo_izq_px = ALTO_LOGO_PX * (80 / 106);
    const ancho_logo_der_px = ALTO_LOGO_PX * (95 / 125);

    const zip = new JSZip();
    zip.file('[Content_Types].xml', CONTENT_TYPES);
    zip.file('_rels/.rels', RELS_RAIZ);
    zip.file('xl/workbook.xml', construir_workbook(modulo.nombre_hoja));
    zip.file('xl/_rels/workbook.xml.rels', WORKBOOK_RELS);
    zip.file('xl/styles.xml', STYLES);
    zip.file('xl/worksheets/sheet1.xml', construir_hoja(modulo.filas, valores, metadatos, modulo.titulo));
    zip.file('xl/worksheets/_rels/sheet1.xml.rels', SHEET_RELS);
    zip.file('xl/drawings/drawing1.xml', construir_drawing(ancho_logo_izq_px, ancho_logo_der_px));
    zip.file('xl/drawings/_rels/drawing1.xml.rels', DRAWING_RELS);
    zip.file('xl/media/image1.jpg', logo_izq);
    zip.file('xl/media/image2.jpg', logo_der);

    const contenido = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    await fs.mkdir(RUTAS.temporales_excel, { recursive: true });
    const nombre_archivo = `informe_mensual_${modulo_id}_${randomUUID()}.xlsx`;
    const ruta_salida = path.join(RUTAS.temporales_excel, nombre_archivo);
    await fs.writeFile(ruta_salida, contenido);

    return {
        mensaje: 'Archivo XLSX del Informe Mensual generado correctamente.',
        formato: `informe_mensual_${modulo_id}`,
        nombre_archivo,
        ruta_archivo: ruta_salida,
    };
}

module.exports = { generar_xls_informe_mensual, MODULOS };