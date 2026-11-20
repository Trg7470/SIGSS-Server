const {mysqlPool} = require('../config/mysql');

class AtencionPreventiva {
    static async registrar(data, connection = mysqlPool)
    {
        const [result] = await connection.query(
            `INSERT INTO Atencion_Preventiva (Deteccion_Placa_Bacteriana, Instruccion_Tecnica_Cepillado,
            Instruccion_Uso_Hilo, Aplicacion_Topica_Fluor, Aplicacion_Barniz_Fluor, Limpieza_Dental,
            Raspado_Aislado_Periodontal, Rev_Instruccion_Higiene_Protesis, Rev_Tejidos_Bucales,
            Instruccion_Autoexamen, Sellado_Fosetas_Fisuras)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.Deteccion_Placa_Bacteriana, data.Instruccion_Tecnica_Cepillado,
            data.Instruccion_Uso_Hilo, data.Aplicacion_Topica_Fluor, data.Aplicacion_Barniz_Fluor,
            data.Limpieza_Dental, data.Raspado_Aislado_Periodontal, data.Rev_Instruccion_Higiene_Protesis,
            data.Rev_Tejidos_Bucales, data.Instruccion_Autoexamen, data.Sellado_Fosetas_Fisuras]
        );
        return {success: true, Id_Atencion_Preventiva: result.insertId};
    }
}

module.exports = AtencionPreventiva;
