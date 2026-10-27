const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');
const ExcelJS = require('exceljs');
const RUTAS = require('../../config/rutas');
const PACIENTE_CONFIG = require('./formatos/paciente.config');
const FORMATOS =  { paciente: PACIENTE_CONFIG };


/**
 * Genera un archivo XLSX a partir de una plantilla.
 *
 * @param {string} idFormato - Identificador del formato registrado.
 * @returns {Promise<object>} Información del archivo generado.
 */


/**
 * Prepara los datos para la plantilla del paciente.
 * Datos ficticios/de prueba para verificar la generación.
 */
function PrepararDatos(idFormato) {
    switch (idFormato) {
        case 'paciente':
            return {
                nombrePaciente: 'ILEANA SARAI HURTADO FLORES',
                curp: 'HUFI041127MDGRLLA9',
                edad: '22 AÑOS',
                sexo: 'FEMENINO',
                fechaNacimiento: '27/11/2004',
                unidadSalud: 'CESSA DR. ISAURO VENZOR',
                medicoResponsable: 'DRA. ZERETH DIAZCOUDER MOREIRA',
                fechaRegistro: '18/10/2026',
            };

        default:
            throw new Error(
                `No existe una preparación de datos para "${idFormato}".`
            );
    }
}


/**
 * Calcula una altura aproximada para mostrar el texto de una celda.
 */
function CalcularAlturaFila(celda, texto) {
    const fuente = celda.font || {};
    const tamanoFuente = fuente.size || 11;

    // Obtener el ancho de la columna
    const anchoColumna = celda.worksheet.getColumn(
        celda.col
    ).width || 10;

    // Aproximar cuántos caracteres caben por línea
    const caracteresPorLinea = Math.max(
        1,
        Math.floor(anchoColumna * 1.1)
    );

    // Calcular las líneas necesarias, considerando saltos de línea
    const lineas = String(texto).split('\n').reduce(
        (total, parte) => {
            return total + Math.max(
                1,
                Math.ceil(parte.length / caracteresPorLinea)
            );
        },
        0
    );

    // Aproximar la altura necesaria según la fuente
    const alturaLinea = tamanoFuente * 1.5;
    return Math.ceil(lineas * alturaLinea + 6);
}


async function GenerarXls(idFormato) {
    try {
        // Validar el formato solicitado
        if (typeof idFormato !== 'string' || !idFormato.trim()) {
            throw new Error('Debe especificar un formato válido.');
        }

        const configuracion = FORMATOS[idFormato];
        if (!configuracion) {
            throw new Error(`El formato "${idFormato}" no está registrado.`);
        }

        // Validar los datos recibidos
        const datos = PrepararDatos(idFormato);
        if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
            throw new Error('Los datos deben proporcionarse como un objeto.');
        }

        // Obtener y validar la ruta de la plantilla
        const rutaPlantilla = path.join(RUTAS.formatosExcel, configuracion.plantilla);
        const rutaRealPlantilla = await fs.realpath(rutaPlantilla);
        const rutaRealFormatos = await fs.realpath(RUTAS.formatosExcel);
        // Evitar que una configuración apunte fuera de la carpeta de plantillas
        const rutaRelativa = path.relative(rutaRealFormatos, rutaRealPlantilla);

        if (
            rutaRelativa === '..' ||
            rutaRelativa.startsWith(`..${path.sep}`) ||
            path.isAbsolute(rutaRelativa)
        ) {
            throw new Error('La plantilla se encuentra fuera del directorio autorizado.');
        }

        const informacionPlantilla = await fs.stat(rutaRealPlantilla);
        if (!informacionPlantilla.isFile()) {
            throw new Error('La plantilla indicada no es un archivo válido.');
        }

        // Crear el directorio temporal si no existe
        await fs.mkdir(RUTAS.temporalesExcel, { recursive: true });
        // Abrir la plantilla sin modificar el archivo original
        const libro = new ExcelJS.Workbook();
        await libro.xlsx.readFile(rutaRealPlantilla);
        // Obtener la hoja configurada
        const hoja = libro.getWorksheet(configuracion.hoja);

        if (!hoja) {
            throw new Error(`No existe la hoja "${configuracion.hoja}" en la plantilla.`);
        }
        // Escribir los datos en las celdas configuradas
        for (const [campo, celda] of Object.entries(configuracion.celdas)) {
            if (!Object.prototype.hasOwnProperty.call(datos, campo)) {
                throw new Error(`Falta el dato requerido: "${campo}".`);
            }

            const valor = datos[campo];

            if (
                valor === undefined ||
                valor === null ||
                (typeof valor === 'string' && !valor.trim())
            ) {
                throw new Error(`El dato "${campo}" no puede estar vacío.`);
            }

            if (
                !['string', 'number', 'boolean'].includes(typeof valor) ||
                (typeof valor === 'number' && !Number.isFinite(valor))
            ) {
                throw new Error(`El valor de "${campo}" no es válido.`);
            }

            
            const celdaExcel = hoja.getCell(celda);

            // Guardar la altura original antes de modificarla
            const fila = hoja.getRow(celdaExcel.row);
            const alturaOriginal = fila.height;

            // Obtener el título existente en la plantilla
            const titulo = String(celdaExcel.text || '').trim();

            // Convertir el dato a texto para insertarlo en Excel
            const textoDato = String(valor);

            // Conservar el título si existe
            celdaExcel.value = titulo
                ? `${titulo}\n${textoDato}`
                : textoDato;

            // Permitir que el texto continúe en varias líneas
            celdaExcel.alignment = {
                ...celdaExcel.alignment,
                wrapText: true,
                vertical: 'middle',
            };

            // Obtener el texto completo de la celda
            const textoFinal = String(celdaExcel.value);

            // Calcular la altura estimada que necesita el contenido
            const alturaNecesaria = CalcularAlturaFila(
                celdaExcel,
                textoFinal
            );

            // Considerar 15 puntos como altura predeterminada de Excel
            const alturaBase = alturaOriginal ?? 15;

            // Aumentar la altura solo si el contenido lo necesita
            if (alturaNecesaria > alturaBase) {
                fila.height = alturaNecesaria;
            } else {
                fila.height = alturaOriginal;
            }

        }

        // Generar archivo temporal con un nombre
        const nombreArchivo = `paciente_${randomUUID()}.xlsx`;
        const rutaSalida = path.join(RUTAS.temporalesExcel,nombreArchivo);
        // Guardar el XLSX generado
        await libro.xlsx.writeFile(rutaSalida);

        // Devolver los datos necesarios para utilizar el archivo
        return {
            mensaje: 'Archivo XLSX generado correctamente.',
            formato: configuracion.id,
            nombreArchivo,
            rutaArchivo: rutaSalida,
        };
    } catch (error) {
        // Registrar el error técnico sin incluir datos clínicos
        console.error('[GenerarXls]', error.message);
        throw new Error(`No fue posible generar el XLSX: ${error.message}`);
    }
}

module.exports = {GenerarXls};