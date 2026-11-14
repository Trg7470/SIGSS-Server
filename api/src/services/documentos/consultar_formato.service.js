'use strict';

const { mysqlPool } = require('../../config/mysql');
const { resolver_catalogo } = require('../../utils/catalogos'); // ajusta el nombre si le pusiste "consultas.js"
const CONSULTA_EXTERNA_MAPEO = require('./formatos/consulta_externa.mapeo');

const MAPEOS = { 'consulta-externa': CONSULTA_EXTERNA_MAPEO };
const VISTAS = { 'consulta-externa': 'vista_consulta_externa' };

function resolver_campo(origen, fila) {
    if (typeof origen.calcular === 'function') {
        return origen.calcular(fila);
    }
    const valor_crudo = fila[origen.columna];
    if (origen.booleano) {
        if (valor_crudo === null || valor_crudo === undefined) return undefined;
        return Number(valor_crudo) ? 'Si' : 'No';
    }
    return origen.catalogo
        ? resolver_catalogo(origen.catalogo, valor_crudo)
        : valor_crudo;
}

function mapear_fila(mapeo, fila) {
    const registro = {};
    for (const [llave_plantilla, origen] of Object.entries(mapeo)) {
        registro[llave_plantilla] = resolver_campo(origen, fila);
    }
    return registro;
}

async function consultar_formato(id_formato, parametros) {
    const mapeo = MAPEOS[id_formato];
    const vista = VISTAS[id_formato];
    if (!mapeo || !vista) {
        throw new Error(`No hay mapeo de consulta para "${id_formato}".`);
    }
    if (!parametros || !parametros.fecha) {
        throw new Error('Debe especificar la fecha a consultar.');
    }

    const condiciones = ['fecha >= ? AND fecha < DATE_ADD(?, INTERVAL 1 DAY)'];
    const valores = [parametros.fecha, parametros.fecha];
    if (parametros.clues) {
        condiciones.push('clues = ?');
        valores.push(parametros.clues);
    }

    const [filas] = await mysqlPool.query(
        `SELECT * FROM ${vista} WHERE ${condiciones.join(' AND ')} ORDER BY id_consulta`,
        valores
    );

    if (filas.length === 0) {
        throw new Error('No hay consultas registradas para esa fecha.');
    }

    const primera = filas[0];
    return {
        encabezado: {
            clues: primera.clues,
            nombre_unidad: primera.nombre_unidad,
            curp_prestador: primera.curp_prestador,
            nombre_prestador: primera.nombre_prestador,
            tipo_personal: primera.tipo_personal,
            cedula_profesional: primera.cedula_profesional,
            fecha: parametros.fecha,
        },
        registros: filas.map((fila) => mapear_fila(mapeo, fila)),
    };
}

module.exports = { consultar_formato, mapear_fila };