'use strict';

const CATALOGOS = require('../data/catalogos.json');

const INDICE = Object.fromEntries(
    Object.entries(CATALOGOS).map(([nombre_catalogo, elementos]) => {
        const columna_id = Object.keys(elementos[0]).find((c) => c.startsWith('Id_Cat_'));
        const mapa = new Map(
            elementos.map((el) => [el[columna_id], { nombre: el.Nombre, clave: el.Clave }])
        );
        return [nombre_catalogo, mapa];
    })
);

function resolver_catalogo(nombre_catalogo, id, campo = 'nombre') {
    if (id === null || id === undefined) return undefined;
    const catalogo = INDICE[nombre_catalogo];
    if (!catalogo) throw new Error(`No existe el catálogo "${nombre_catalogo}".`);
    const elemento = catalogo.get(id);
    if (!elemento) throw new Error(`El id ${id} no existe en el catálogo "${nombre_catalogo}".`);
    return elemento[campo];
}

module.exports = { resolver_catalogo };