
const path = require('path');

const RUTAS = {
    // Directorio principal del proyecto
    raiz: path.join(__dirname, '..', '..'),
    // Formatos de Excel
    formatosExcel: path.join(__dirname, '..', 'recursos', 'formatos'),
    // Archivos Excel generados temporalmente
    temporalesExcel: path.join(__dirname, '..', 'temp', 'xls'),
    // Archivos PDF generados temporalmente
    temporalesPDF: path.join(__dirname, '..', 'temp', 'pdf'),
    // Directorio de servicios de documentos
    serviciosDocumentos: path.join(__dirname, '..', 'services', 'documentos'),
    // Ejecutable de LibreOffice
    libreOffice: 'soffice',
};

module.exports = RUTAS;
