const { mysqlPool } = require('../config/mysql');

class NotasMedicas {
    /** Busca si ya existe una nota médica para esta consulta (son 1:1). */
    static async buscar_por_consulta(Id_Consulta, connection = mysqlPool) {
        const [filas] = await connection.query(
            `SELECT Id_Nota_Medica FROM Notas_Medicas WHERE Consultas_Id_Consulta = ? LIMIT 1`,
            [Id_Consulta]
        );
        return filas[0] || null;
    }

    static async registrar(Id_Consulta, data, connection = mysqlPool) {
        const [result] = await connection.query(
            `INSERT INTO Notas_Medicas
                (Consultas_Id_Consulta, Hora_Consulta, Motivo_Consulta,
                 Padecimiento_Actual, Exploracion_Fisica, Resultado_Estudios,
                 Pronostico, Indicaciones_Generales)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Id_Consulta,
                data.Hora_Consulta, data.Motivo_Consulta, data.Padecimiento_Actual,
                data.Exploracion_Fisica, data.Resultado_Estudios,
                data.Pronostico, data.Indicaciones_Generales,
            ]
        );
        return { success: true, Id_Nota_Medica: result.insertId };
    }

    static async actualizar(Id_Nota_Medica, data, connection = mysqlPool) {
        await connection.query(
            `UPDATE Notas_Medicas SET
                Hora_Consulta = ?,
                Motivo_Consulta = ?,
                Padecimiento_Actual = ?,
                Exploracion_Fisica = ?,
                Resultado_Estudios = ?,
                Pronostico = ?,
                Indicaciones_Generales = ?
             WHERE Id_Nota_Medica = ?`,
            [
                data.Hora_Consulta, data.Motivo_Consulta, data.Padecimiento_Actual,
                data.Exploracion_Fisica, data.Resultado_Estudios,
                data.Pronostico, data.Indicaciones_Generales,
                Id_Nota_Medica,
            ]
        );
        return { success: true, Id_Nota_Medica };
    }
}

module.exports = NotasMedicas;