const PACIENTE_CONFIG = {
    id: 'paciente',
    nombre: 'Datos del paciente',
    // Nombre de la plantilla de Excel
    plantilla: 'plantilla_prueba_paciente.xlsx',
    // Nombre de la hoja
    hoja: 'Datos del paciente',
    // Relación entre los datos y las celdas de Excel
    celdas: {
        nombrePaciente: 'B2',
        curp: 'B3',
        edad: 'B4',
        sexo: 'B5',
        fechaNacimiento: 'B6',
        unidadSalud: 'B7',
        medicoResponsable: 'B8',
        fechaRegistro: 'B9',
    },
};

module.exports = PACIENTE_CONFIG;
