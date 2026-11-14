'use strict';

const path = require('path');

/**
 * Rutas centralizadas del backend de SIGSS.
 */
module.exports = {
    // Carpeta que contiene los formatos de Excel (plantillas) que se pueden exportar.
    formatos_excel: path.join(__dirname, '..', 'recursos', 'formatos'),

    // Carpeta donde se guardan los XLSX generados temporalmente.
    temporales_excel: path.join(__dirname, '..', 'temp', 'xls'),

    // Carpeta donde se guardan los PDF generados temporalmente.
    temporales_pdf: path.join(__dirname, '..', 'temp', 'pdf'),

    // Ruta al ejecutable de LibreOffice (conversión headless XLSX -> PDF).
    libre_office: 'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
};