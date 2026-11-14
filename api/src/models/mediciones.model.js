const {mysqlPool} = require('../config/mysql');

class Mediciones {
    static async registrar(data, connection = mysqlPool)
    {
        const [result] = await connection.query(
            `INSERT INTO Mediciones (Consultas_Id_Consulta, Peso, Talla, Circunferencia_Cintura, Presion_Sistolica, 
            Presion_Diastolica, Frecuencia_Cardiaca, Frecuencia_Respiratoria, Temperatura, Saturacion_Oxigeno, Glucosa,
            Resultado_Glucosa, Glucosa_Ayuno, Numero_Tiras, Probable_Tb) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.Id_Consulta, data.Peso, data.Talla, 
            data.Circunferencia_Cintura, data.Presion_Sistolica, data.Presion_Diastolica, 
            data.Frecuencia_Cardiaca, data.Frecuencia_Respiratoria, data.Temperatura, 
            data.Saturacion_Oxigeno, data.Glucosa, data.Resultado_Glucosa, data.Glucosa_Ayuno, 
            data.Numero_Tiras, data.Probable_Tb]);
        return {success: true, Id_Medicion: result.insertId};
    } 
}

module.exports = Mediciones;