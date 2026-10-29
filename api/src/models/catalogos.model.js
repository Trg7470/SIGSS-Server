const {mysqlPool} = require('../config/mysql');

class Catalogos
{
    static async servicios()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Servicios'
        );
        return rows;
    }
    static async complicaciones()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Complicaciones'
        );
        return rows;
    }
    static async derechohabiencia()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Derechohabiencia'
        );
        return rows;
    }
    static async diagnosticos()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Diagnosticos'
        );
        return rows;
    }
    static async diagnosticos_nombre(nombre)
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Diagnosticos WHERE Nombre LIKE ?',
            [`${nombre}%`]
        );
        return rows;
    }
    static async discapacidades()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Discapacidades'
        );
        return rows;
    }
    static async espirometria_resultados()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Espirometria_Resultados'
        );
        return rows;
    }
    static async grupos_its()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Grupos_Its'
        );
        return rows;
    }
    static async implante_subdermico()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Implante_Subdermico'
        );
        return rows;        
    }
    static async intervenciones_gerontologicas()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Intervenciones_Gerontologicas'
        );
        return rows;
    }
    static async medicina_tradicional()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Medicina_Tradicional'
        );
        return rows;
    
    }
    static async referido_motivo()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Referido_Motivo'
        );
        return rows;
    }
    static async referido_nivel()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Referido_Nivel'
        );
        return rows;
    }
    static async resultados_its()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Resultados_Its'
        );
        return rows;
    }
    static async riesgos()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Riesgos'
        );
        return rows;
    }
    static async teleconsulta_interpretacion()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Teleconsulta_Interpretacion'
        );
        return rows;
    }
    static async tipo_personal()
    {
        const [rows] = await mysqlPool.query(
            'SELECT * FROM Cat_Tipo_Personal'
        );
        return rows;
    }
}

module.exports = Catalogos;