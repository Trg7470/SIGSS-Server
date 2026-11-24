const { mysqlPool } = require('../config/mysql');

class ConsumoSustanciasPsicoactivas {
    /** Bloque "Consumo de sustancias psicoactivas". Opcional, igual que las demás. */
    static async registrar(data, connection = mysqlPool) {
        const [result] = await connection.query(
            `INSERT INTO Consumo_Sustancias_Psicoactivas
                (Alcohol, Tabaco, Cannabis, Cocaina, Metanfetaminas,
                 Inhalables, Opiaceos, Alucinogenos, Tranquilizantes, Otras_Sustancias)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                data.Alcohol,
                data.Tabaco,
                data.Cannabis,
                data.Cocaina,
                data.Metanfetaminas,
                data.Inhalables,
                data.Opiaceos,
                data.Alucinogenos,
                data.Tranquilizantes,
                data.Otras_Sustancias,
            ]
        );
        return { Id_Consumo_Sustancias_Psicoactivas: result.insertId };
    }
}

module.exports = ConsumoSustanciasPsicoactivas;