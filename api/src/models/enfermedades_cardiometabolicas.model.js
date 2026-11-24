const { mysqlPool } = require('../config/mysql');

class EnfermedadesCardiometabolicas {
    /** Bloque "Enfermedades cardiometabólicas". Opcional, igual que las demás. */
    static async registrar(data, connection = mysqlPool) {
        const [result] = await connection.query(
            `INSERT INTO Enfermedades_Cardiometabolicas
                (Diabetes_Mellitus, Hipertension_Arterial_Sistemica, Obesidad,
                 Dislipidemias, Enfermedad_Renal_Cronica)
             VALUES (?, ?, ?, ?, ?)`,
            [
                data.Diabetes_Mellitus,
                data.Hipertension_Arterial_Sistemica,
                data.Obesidad,
                data.Dislipidemias,
                data.Enfermedad_Renal_Cronica,
            ]
        );
        return { Id_Enfermedades_Cardiometabolicas: result.insertId };
    }
}

module.exports = EnfermedadesCardiometabolicas;