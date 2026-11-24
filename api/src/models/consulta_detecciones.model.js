const { mysqlPool } = require('../config/mysql');

class ConsultaDetecciones {
    /**
     * Registra la fila principal de Detecciones, una vez que ya existen
     * (si aplicaban) los IDs de sus sub-bloques opcionales: ITS,
     * Consumo_Sustancias_Psicoactivas, Enfermedades_Cardiometabolicas y
     * Detecciones_Revaloraciones. Cualquiera de esos 4 puede venir null
     * si ese bloque no se capturó en esta consulta.
     *
     * @param {number} Id_Consulta
     * @param {object} ids - { Id_Cat_Espirometria_Resultados, Id_ITS,
     *   Id_Consumo_Sustancias_Psicoactivas, Id_Enfermedades_Cardiometabolicas,
     *   Id_Detecciones_Revaloraciones }
     * @param {object} campos - el resto de columnas directas de Consulta_Detecciones.
     */
    static async registrar(Id_Consulta, ids, campos, connection = mysqlPool) {
        const [result] = await connection.query(
            `INSERT INTO Consulta_Detecciones
                (Consultas_Id_Consulta,
                 Cat_Espirometria_Resultados_Id_Cat_Espirometria_Resultados,
                 ITS_Id_ITS,
                 Consumo_S_P_Id_Consumo_Sustancias_Psicoactivas,
                 Enfermedades_Cardiometabolicas_Id_Enfermedades_Cardiometabolicas,
                 Detecciones_Revaloraciones_Id_Detecciones_Revaloraciones,
                 Tiras_Utilizadas, Prueba_Rapida_HCG, Esta_Embarazada,
                 Frecuentemente_Triste, Depresion, Ansiedad,
                 Riesgo_Fracturas_Osteoporosis, Exploracion_Cancer_Mama,
                 Violencia_Sexual, Violencia_Mujeres_15_Anos, Sindrome_Turner,
                 Hiperplasia_Prostatica, Reactivos_Antigeno_Prostatico,
                 Probable_TB_Estudio, Cancer_Cervicouterino_Realizado,
                 Cancer_Cervicouterino_Resultado, Espirometria_VEF1,
                 Espirometria_CVF, Espirometria_LIN)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Id_Consulta,
                ids.Id_Cat_Espirometria_Resultados,
                ids.Id_ITS,
                ids.Id_Consumo_Sustancias_Psicoactivas,
                ids.Id_Enfermedades_Cardiometabolicas,
                ids.Id_Detecciones_Revaloraciones,
                campos.Tiras_Utilizadas,
                campos.Prueba_Rapida_HCG,
                campos.Esta_Embarazada,
                campos.Frecuentemente_Triste,
                campos.Depresion,
                campos.Ansiedad,
                campos.Riesgo_Fracturas_Osteoporosis,
                campos.Exploracion_Cancer_Mama,
                campos.Violencia_Sexual,
                campos.Violencia_Mujeres_15_Anos,
                campos.Sindrome_Turner,
                campos.Hiperplasia_Prostatica,
                campos.Reactivos_Antigeno_Prostatico,
                campos.Probable_TB_Estudio,
                campos.Cancer_Cervicouterino_Realizado,
                campos.Cancer_Cervicouterino_Resultado,
                campos.Espirometria_VEF1,
                campos.Espirometria_CVF,
                campos.Espirometria_LIN,
            ]
        );
        return { Id_Consulta_Detecciones: result.insertId };
    }
}

module.exports = ConsultaDetecciones;