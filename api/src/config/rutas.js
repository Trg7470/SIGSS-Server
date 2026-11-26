'use strict';

const path = require('path');

module.exports = {
    formatos_excel: path.join(__dirname, '..', 'recursos', 'formatos'),
    temporales_excel: path.join(__dirname, '..', 'temp', 'xls'),
    temporales_pdf: path.join(__dirname, '..', 'temp', 'pdf'),
    libre_office: 'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
    imagenes: path.join(__dirname, '..', 'recursos', 'imagenes'),
};