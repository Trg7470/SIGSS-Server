'use strict';

const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const JSZip = require('jszip');
const RUTAS = require('../../config/rutas');
const { escapar_xml } = require('../../utils/plantilla_xlsx');

const LOGO_IZQUIERDO = 'Logo_SIGSS.jpeg';
const LOGO_DERECHO = 'SSD_Servicios_Durango_Azul.jpeg';

const COLUMNAS = ['Fecha y hora', 'Usuario', 'Módulo', 'Acción', 'Tabla afectada', 'ID afectado'];
const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F'];
const ULTIMA_COLUMNA = LETRAS[LETRAS.length - 1];

function fecha_a_serial_excel(fecha) {
    const dias = Date.UTC(fecha.getFullYear(), fecha.getMonth(), fecha.getDate()) / 86400000
        - Date.UTC(1899, 11, 30) / 86400000;
    const fraccion_dia = (fecha.getHours() * 3600 + fecha.getMinutes() * 60 + fecha.getSeconds()) / 86400;
    return dias + fraccion_dia;
}

function formatear_fecha_corta(fecha_iso) {
    const [anio, mes, dia] = String(fecha_iso).split('-');
    return `${dia}/${mes}/${anio}`;
}

function formatear_fecha_larga(fecha) {
    return fecha.toLocaleString('es-MX', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    });
}

function celda_texto(referencia, valor, estilo) {
    return `<c r="${referencia}" s="${estilo}" t="inlineStr"><is><t xml:space="preserve">${escapar_xml(valor ?? '')}</t></is></c>`;
}

function celda_fecha(referencia, fecha, estilo) {
    return `<c r="${referencia}" s="${estilo}"><v>${fecha_a_serial_excel(fecha)}</v></c>`;
}

function celda_vacia(referencia, estilo) {
    return `<c r="${referencia}" s="${estilo}"/>`;
}

function construir_hoja(registros, metadatos) {
    const filas_xml = [];
    const combinaciones = [];

    filas_xml.push(
        `<row r="1" ht="45" customHeight="1">` +
        celda_vacia('A1', 3) +
        celda_texto('B1', 'Registro de actividades del sistema (Bitácora)', 2) +
        celda_vacia('C1', 2) +
        celda_vacia('D1', 2) +
        celda_vacia('E1', 2) +
        celda_vacia('F1', 3) +
        `</row>`
    );
    combinaciones.push('B1:E1');

    const lineas_meta = [
        `Rango de fechas: ${formatear_fecha_corta(metadatos.fecha_inicio)} - ${formatear_fecha_corta(metadatos.fecha_fin)}`,
        `Usuario filtrado: ${metadatos.usuario_filtro || 'Todos los usuarios'}     Módulo filtrado: ${metadatos.modulo_filtro || 'Todos los módulos'}`,
        `Generado el: ${formatear_fecha_larga(new Date())} por ${metadatos.generado_por || 'Administrador'}`,
        `Total de registros: ${registros.length}`,
    ];
    lineas_meta.forEach((texto, indice) => {
        const fila = indice + 2;
        filas_xml.push(`<row r="${fila}">${celda_texto(`A${fila}`, texto, 1)}${LETRAS.slice(1).map((col) => celda_vacia(`${col}${fila}`, 0)).join('')}</row>`);
        combinaciones.push(`A${fila}:${ULTIMA_COLUMNA}${fila}`);
    });

    filas_xml.push(`<row r="6">${LETRAS.map((col) => celda_vacia(`${col}6`, 0)).join('')}</row>`);

    filas_xml.push(
        `<row r="7">${COLUMNAS.map((titulo, indice) => celda_texto(`${LETRAS[indice]}7`, titulo, 4)).join('')}</row>`
    );

    registros.forEach((registro, indice) => {
        const fila = indice + 8;
        filas_xml.push(
            `<row r="${fila}">` +
            celda_fecha(`A${fila}`, new Date(registro.Fecha_Hora), 5) +
            celda_texto(`B${fila}`, registro.Usuario, 6) +
            celda_texto(`C${fila}`, registro.Modulo, 6) +
            celda_texto(`D${fila}`, registro.Accion, 6) +
            celda_texto(`E${fila}`, registro.Tabla_Afectada ?? '', 6) +
            celda_texto(`F${fila}`, registro.Id_Registro_Afectado ?? '', 6) +
            `</row>`
        );
    });

    const ultima_fila = registros.length + 7;

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheetPr><pageSetUpPr fitToPage="1"/></sheetPr>
<dimension ref="A1:${ULTIMA_COLUMNA}${ultima_fila}"/>
<sheetViews>
<sheetView workbookViewId="0">
<pane ySplit="7" topLeftCell="A8" activePane="bottomLeft" state="frozen"/>
<selection pane="bottomLeft" activeCell="A8" sqref="A8"/>
</sheetView>
</sheetViews>
<cols>
<col min="1" max="1" width="20"/>
<col min="2" max="2" width="28"/>
<col min="3" max="3" width="22"/>
<col min="4" max="4" width="35"/>
<col min="5" max="5" width="22"/>
<col min="6" max="6" width="16"/>
</cols>
<sheetData>${filas_xml.join('')}</sheetData>
<autoFilter ref="A7:${ULTIMA_COLUMNA}${ultima_fila}"/>
<mergeCells count="${combinaciones.length}">${combinaciones.map((ref) => `<mergeCell ref="${ref}"/>`).join('')}</mergeCells>
<pageMargins left="0.5" right="0.5" top="0.5" bottom="0.5" header="0.3" footer="0.3"/>
<pageSetup orientation="landscape" fitToWidth="1" fitToHeight="0"/>
<drawing r:id="rIdDrawing"/>
</worksheet>`;
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Default Extension="jpg" ContentType="image/jpeg"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
<Override PartName="/xl/drawings/drawing1.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>
</Types>`;

const RELS_RAIZ = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

const WORKBOOK = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Bitácora" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

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

const DRAWING = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<xdr:twoCellAnchor editAs="oneCell">
<xdr:from><xdr:col>0</xdr:col><xdr:colOff>400000</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>61913</xdr:rowOff></xdr:from>
<xdr:to><xdr:col>0</xdr:col><xdr:colOff>904825</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>509588</xdr:rowOff></xdr:to>
<xdr:pic>
<xdr:nvPicPr><xdr:cNvPr id="1" name="Logo SIGSS"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr>
<xdr:blipFill><a:blip r:embed="rId1"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>
<xdr:spPr><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr>
</xdr:pic>
<xdr:clientData/>
</xdr:twoCellAnchor>
<xdr:twoCellAnchor editAs="oneCell">
<xdr:from><xdr:col>5</xdr:col><xdr:colOff>681000</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>61913</xdr:rowOff></xdr:from>
<xdr:to><xdr:col>5</xdr:col><xdr:colOff>1185825</xdr:colOff><xdr:row>0</xdr:row><xdr:rowOff>509588</xdr:rowOff></xdr:to>
<xdr:pic>
<xdr:nvPicPr><xdr:cNvPr id="2" name="Logo Servicios de Salud Durango"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr>
<xdr:blipFill><a:blip r:embed="rId2"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>
<xdr:spPr><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr>
</xdr:pic>
<xdr:clientData/>
</xdr:twoCellAnchor>
</xdr:wsDr>`;

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<numFmts count="1"><numFmt numFmtId="164" formatCode="dd/mm/yyyy hh:mm"/></numFmts>
<fonts count="3">
<font><sz val="11"/><name val="Calibri"/></font>
<font><sz val="10"/><name val="Arial"/></font>
<font><b/><sz val="11"/><name val="Arial"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFD9D9D9"/><bgColor indexed="64"/></patternFill></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFBDD7EE"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border><left style="thin"><color indexed="64"/></left><right style="thin"><color indexed="64"/></right><top style="thin"><color indexed="64"/></top><bottom style="thin"><color indexed="64"/></bottom><diagonal/></border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="7">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1"><alignment horizontal="left" vertical="center"/></xf>
<xf numFmtId="0" fontId="2" fillId="1" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1"/>
<xf numFmtId="0" fontId="2" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="164" fontId="1" fillId="0" borderId="1" xfId="0" applyNumFmt="1" applyFont="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center"/></xf>
<xf numFmtId="0" fontId="1" fillId="0" borderId="1" xfId="0" applyFont="1" applyBorder="1" applyAlignment="1"><alignment wrapText="1" vertical="top"/></xf>
</cellXfs>
</styleSheet>`;

async function generar_xls_bitacora(registros, metadatos = {}) {
    if (!Array.isArray(registros) || registros.length === 0) {
        throw new Error('No hay registros de bitácora para exportar.');
    }

    const ruta_logo_izq = path.join(RUTAS.imagenes, LOGO_IZQUIERDO);
    const ruta_logo_der = path.join(RUTAS.imagenes, LOGO_DERECHO);
    const [logo_izq, logo_der] = await Promise.all([
        fs.readFile(ruta_logo_izq),
        fs.readFile(ruta_logo_der),
    ]);

    const zip = new JSZip();
    zip.file('[Content_Types].xml', CONTENT_TYPES);
    zip.file('_rels/.rels', RELS_RAIZ);
    zip.file('xl/workbook.xml', WORKBOOK);
    zip.file('xl/_rels/workbook.xml.rels', WORKBOOK_RELS);
    zip.file('xl/styles.xml', STYLES);
    zip.file('xl/worksheets/sheet1.xml', construir_hoja(registros, metadatos));
    zip.file('xl/worksheets/_rels/sheet1.xml.rels', SHEET_RELS);
    zip.file('xl/drawings/drawing1.xml', DRAWING);
    zip.file('xl/drawings/_rels/drawing1.xml.rels', DRAWING_RELS);
    zip.file('xl/media/image1.jpg', logo_izq);
    zip.file('xl/media/image2.jpg', logo_der);

    const contenido = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });

    await fs.mkdir(RUTAS.temporales_excel, { recursive: true });
    const nombre_archivo = `bitacora_${randomUUID()}.xlsx`;
    const ruta_salida = path.join(RUTAS.temporales_excel, nombre_archivo);
    await fs.writeFile(ruta_salida, contenido);

    return {
        mensaje: 'Archivo XLSX de bitácora generado correctamente.',
        formato: 'bitacora',
        nombre_archivo,
        ruta_archivo: ruta_salida,
        consultas: registros.length,
    };
}

module.exports = { generar_xls_bitacora };