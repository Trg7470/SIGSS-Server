const { mysqlPool } = require('../config/mysql');

function filtro_fechas(alias, fecha_inicial, fecha_final) {
    const condiciones = [];
    const valores = [];

    if (fecha_inicial) {
        condiciones.push(`${alias}.Fecha_Consulta >= ?`);
        valores.push(fecha_inicial);
    }
    if (fecha_final) {
        condiciones.push(`${alias}.Fecha_Consulta <= ?`);
        valores.push(fecha_final);
    }
    return { condiciones, valores };
}

function filtro_prestador(alias, prestador) {
    if (!prestador) return { condiciones: [], valores: [] };
    return {
        condiciones: [`${alias}.Prestadores_Id_Prestador = ?`],
        valores: [prestador]
    };
}

class Estadisticas {

    static async consultas_por_modulo(filtros = {}) {
        const { fecha_inicial, fecha_final, prestador } = filtros;
        const f = filtro_fechas('c', fecha_inicial, fecha_final);
        const p = filtro_prestador('c', prestador);
        const condiciones = [...f.condiciones, ...p.condiciones];
        const where = condiciones.length ? `AND ${condiciones.join(' AND ')}` : '';
        const valores = [...f.valores, ...p.valores];

        const [rows] = await mysqlPool.query(`
            SELECT 'Consulta Externa' AS modulo, COUNT(*) AS total
            FROM Consulta_Externa t
            INNER JOIN Consultas c ON c.Id_Consulta = t.Consultas_Id_Consulta
            WHERE 1=1 ${where}
            UNION ALL
            SELECT 'Planificación Familiar', COUNT(*)
            FROM Consulta_Planificacion_Familiar t
            INNER JOIN Consultas c ON c.Id_Consulta = t.Consultas_Id_Consulta
            WHERE 1=1 ${where}
            UNION ALL
            SELECT 'Salud Bucal', COUNT(*)
            FROM Consulta_Salud_Bucal t
            INNER JOIN Consultas c ON c.Id_Consulta = t.Consultas_Id_Consulta
            WHERE 1=1 ${where}
            UNION ALL
            SELECT 'Detecciones', COUNT(*)
            FROM Consulta_Detecciones t
            INNER JOIN Consultas c ON c.Id_Consulta = t.Consultas_Id_Consulta
            WHERE 1=1 ${where}
        `, [...valores, ...valores, ...valores, ...valores]);

        return rows;
    }

    static async consultas_por_medico(filtros = {}) {
        const { fecha_inicial, fecha_final } = filtros;
        const f = filtro_fechas('c', fecha_inicial, fecha_final);
        const where = f.condiciones.length ? `AND ${f.condiciones.join(' AND ')}` : '';

        const [rows] = await mysqlPool.query(`
            SELECT
                p.Id_Prestador,
                CONCAT(p.Nombre, ' ', p.Apellido_Paterno, ' ', p.Apellido_Materno) AS medico,
                COUNT(*) AS total_consultas
            FROM Consultas c
            INNER JOIN Prestadores p ON p.Id_Prestador = c.Prestadores_Id_Prestador
            WHERE 1=1 ${where}
            GROUP BY p.Id_Prestador
            ORDER BY total_consultas DESC
        `, f.valores);

        return rows;
    }

    static async primera_vez_subsecuente(filtros = {}) {
        const { fecha_inicial, fecha_final, prestador } = filtros;
        const f = filtro_fechas('c', fecha_inicial, fecha_final);
        const p = filtro_prestador('c', prestador);
        const condiciones = [...f.condiciones, ...p.condiciones];
        const where = condiciones.length ? `AND ${condiciones.join(' AND ')}` : '';

        const [rows] = await mysqlPool.query(`
            SELECT
                SUM(CASE WHEN cd.Primera_Vez = 1 THEN 1 ELSE 0 END) AS primera_vez,
                SUM(CASE WHEN cd.Primera_Vez = 0 THEN 1 ELSE 0 END) AS subsecuente
            FROM Consulta_Diagnosticos cd
            INNER JOIN Consultas c ON c.Id_Consulta = cd.Consultas_Id_Consulta
            WHERE 1=1 ${where}
        `, [...f.valores, ...p.valores]);

        return rows[0];
    }

    static async tendencia_mensual(filtros = {}) {
        const { fecha_inicial, fecha_final, prestador } = filtros;
        const f = filtro_fechas('c', fecha_inicial, fecha_final);
        const p = filtro_prestador('c', prestador);
        const condiciones = [...f.condiciones, ...p.condiciones];
        const where = condiciones.length ? `AND ${condiciones.join(' AND ')}` : '';

        const [rows] = await mysqlPool.query(`
            SELECT
                DATE_FORMAT(c.Fecha_Consulta, '%Y-%m') AS mes,
                COUNT(*) AS total
            FROM Consultas c
            WHERE 1=1 ${where}
            GROUP BY mes
            ORDER BY mes
        `, [...f.valores, ...p.valores]);

        return rows;
    }

    static async diagnosticos_frecuentes(filtros = {}) {
        const { fecha_inicial, fecha_final, prestador, limite = 10 } = filtros;
        const f = filtro_fechas('c', fecha_inicial, fecha_final);
        const p = filtro_prestador('c', prestador);
        const condiciones = [...f.condiciones, ...p.condiciones];
        const where = condiciones.length ? `AND ${condiciones.join(' AND ')}` : '';

        const [rows] = await mysqlPool.query(`
            SELECT
                cat.Nombre AS diagnostico,
                cat.Clave AS cie10,
                COUNT(*) AS total
            FROM Consulta_Diagnosticos cd
            INNER JOIN Consultas c ON c.Id_Consulta = cd.Consultas_Id_Consulta
            INNER JOIN Cat_Diagnosticos cat
                ON cat.Id_Cat_Diagnosticos = cd.Cat_Diagnosticos_Id_Cat_Diagnosticos
            WHERE 1=1 ${where}
            GROUP BY cat.Id_Cat_Diagnosticos
            ORDER BY total DESC
            LIMIT ?
        `, [...f.valores, ...p.valores, Number(limite)]);

        return rows;
    }

    static async medicamentos_mas_usados(filtros = {}) {
        const { fecha_inicial, fecha_final, prestador, limite = 10 } = filtros;
        const f = filtro_fechas('c', fecha_inicial, fecha_final);
        const p = filtro_prestador('c', prestador);
        const condiciones = [...f.condiciones, ...p.condiciones];
        const where = condiciones.length ? `AND ${condiciones.join(' AND ')}` : '';

        const [rows] = await mysqlPool.query(`
            SELECT
                med.Nombre AS medicamento,
                COUNT(*) AS total
            FROM Nota_Medica_Tratamientos nmt
            INNER JOIN Notas_Medicas nm
                ON nm.Id_Nota_Medica = nmt.Notas_Medicas_Id_Nota_Medica
            INNER JOIN Consultas c ON c.Id_Consulta = nm.Consultas_Id_Consulta
            INNER JOIN Cat_Medicamentos med
                ON med.Id_Cat_Medicamento = nmt.Cat_Medicamentos_Id_Cat_Medicamento
            WHERE 1=1 ${where}
            GROUP BY med.Id_Cat_Medicamento
            ORDER BY total DESC
            LIMIT ?
        `, [...f.valores, ...p.valores, Number(limite)]);

        return rows;
    }

    static async metodos_anticonceptivos(filtros = {}) {
        const { fecha_inicial, fecha_final, prestador } = filtros;
        const f = filtro_fechas('c', fecha_inicial, fecha_final);
        const p = filtro_prestador('c', prestador);
        const condiciones = [...f.condiciones, ...p.condiciones];
        const where = condiciones.length ? `AND ${condiciones.join(' AND ')}` : '';

        const [rows] = await mysqlPool.query(`
            SELECT
                SUM(pf.Oral) AS oral,
                SUM(pf.Inyectable_Mensual) AS inyectable_mensual,
                SUM(pf.Inyectable_Bimestral) AS inyectable_bimestral,
                SUM(pf.Inyectable_Trimestral) AS inyectable_trimestral,
                SUM(pf.Parche_Dermico) AS parche_dermico,
                SUM(pf.DIU) AS diu,
                SUM(pf.DIU_Medicado) AS diu_medicado,
                SUM(pf.Quirurgico) AS quirurgico,
                SUM(pf.Preservativo) AS preservativo,
                SUM(pf.Preservativo_Femenino) AS preservativo_femenino,
                SUM(pf.Otro_Metodo) AS otro_metodo,
                SUM(CASE WHEN pf.Anticoncepcion_Emergencia = 1 THEN 1 ELSE 0 END) AS anticoncepcion_emergencia,
                SUM(CASE WHEN pf.Puerpera_Aceptante = 1 THEN 1 ELSE 0 END) AS puerperas_aceptantes
            FROM Consulta_Planificacion_Familiar pf
            INNER JOIN Consultas c ON c.Id_Consulta = pf.Consultas_Id_Consulta
            WHERE 1=1 ${where}
        `, [...f.valores, ...p.valores]);

        return rows[0];
    }

    static async salud_bucal(filtros = {}) {
        const { fecha_inicial, fecha_final, prestador } = filtros;
        const f = filtro_fechas('c', fecha_inicial, fecha_final);
        const p = filtro_prestador('c', prestador);
        const condiciones = [...f.condiciones, ...p.condiciones];
        const where = condiciones.length ? `AND ${condiciones.join(' AND ')}` : '';

        const [rows] = await mysqlPool.query(`
            SELECT
                SUM(CASE WHEN sb.Atencion_Preventiva_Id_Atencion_Preventiva IS NOT NULL THEN 1 ELSE 0 END) AS preventivas,
                SUM(CASE WHEN sb.Atencion_Curativa_Id_Atencion_Curativa IS NOT NULL THEN 1 ELSE 0 END) AS curativas,
                SUM(CASE WHEN sb.Tratamiento_Integral_Terminado = 1 THEN 1 ELSE 0 END) AS tratamientos_terminados,
                SUM(sb.Radiografias) AS radiografias
            FROM Consulta_Salud_Bucal sb
            INNER JOIN Consultas c ON c.Id_Consulta = sb.Consultas_Id_Consulta
            WHERE 1=1 ${where}
        `, [...f.valores, ...p.valores]);

        return rows[0];
    }

    static async detecciones(filtros = {}) {
        const { fecha_inicial, fecha_final, prestador } = filtros;
        const f = filtro_fechas('c', fecha_inicial, fecha_final);
        const p = filtro_prestador('c', prestador);
        const condiciones = [...f.condiciones, ...p.condiciones];
        const where = condiciones.length ? `AND ${condiciones.join(' AND ')}` : '';

        const [rows] = await mysqlPool.query(`
            SELECT
                SUM(CASE WHEN d.Violencia_Sexual = 1 THEN 1 ELSE 0 END) AS violencia_sexual,
                SUM(CASE WHEN d.Violencia_Mujeres_15_Anos = 1 THEN 1 ELSE 0 END) AS violencia_mujeres,
                SUM(CASE WHEN d.Ansiedad = 1 THEN 1 ELSE 0 END) AS ansiedad,
                SUM(CASE WHEN d.Depresion = 1 THEN 1 ELSE 0 END) AS depresion,
                SUM(CASE WHEN d.Sindrome_Turner = 1 THEN 1 ELSE 0 END) AS sindrome_turner,
                SUM(CASE WHEN d.Hiperplasia_Prostatica = 1 THEN 1 ELSE 0 END) AS hiperplasia_prostatica,
                SUM(CASE WHEN d.Cancer_Cervicouterino_Realizado = 1 THEN 1 ELSE 0 END) AS cacu_realizadas,
                SUM(CASE WHEN d.Cancer_Cervicouterino_Realizado = 1
                          AND d.Cancer_Cervicouterino_Resultado = 1 THEN 1 ELSE 0 END) AS cacu_positivas,
                SUM(CASE WHEN d.Probable_TB_Estudio = 1 THEN 1 ELSE 0 END) AS probable_tb,
                SUM(CASE WHEN d.Riesgo_Fracturas_Osteoporosis IS NOT NULL THEN 1 ELSE 0 END) AS riesgo_osteoporosis
            FROM Consulta_Detecciones d
            INNER JOIN Consultas c ON c.Id_Consulta = d.Consultas_Id_Consulta
            WHERE 1=1 ${where}
        `, [...f.valores, ...p.valores]);

        return rows[0];
    }
}

module.exports = Estadisticas;