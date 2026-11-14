// prueba_exportar.js — en la raíz de src/, corre: node prueba_exportar.js
'use strict';

const { consultar_formato } = require('./services/documentos/consultar_formato.service');
const { exportar_formato } = require('./services/documentos/exportar_formato.service');

(async () => {
    try {
        const datos = await consultar_formato('consulta-externa', { fecha: '2026-11-12' });
        console.log('Encabezado:', datos.encabezado);
        console.log('Número de consultas:', datos.registros.length);
        console.log('Primer registro mapeado:', datos.registros[0]);
console.log(datos.registros.map(r => [r.diagnostico2, r.diagnostico2_primera_vez, r.diagnostico3, r.diagnostico3_primera_vez]));
        const resultado = await exportar_formato('consulta-externa', 'pdf', datos);
        console.log('✅ Archivo generado:', resultado.ruta_archivo);
        console.log('Hojas generadas:', resultado.hojas);
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        process.exit(0);
    }
})();