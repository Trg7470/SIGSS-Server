const mysql = require('mysql2/promise');
require('dotenv').config();

function construirPool(password) {
    return mysql.createPool({
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        user: process.env.MYSQL_USER,
        password,
        database: process.env.MYSQL_DATABASE,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

// Contraseñas candidatas: la tuya y la de tu compañero.
// Así cada quien corre el proyecto con su propio MySQL local,
// sin tener que editar el .env cada vez que cambian de persona.
// Ojo: se descarta la variable solo si NO está definida en el .env;
// si alguien no tiene contraseña en su MySQL local, deja esa
// variable como "" (vacía) en el .env y aquí sí se intenta como
// "sin contraseña" en vez de ignorarse.
const contrasenasCandidatas = [
    process.env.MYSQL_PASSWORD,
    process.env.MYSQL_PASSWORD_ALT
].filter(password => password !== undefined);

// Pool por default (la primera contraseña); connectMySQL() decide
// más abajo cuál de las dos es la que realmente funciona.
let poolActivo = construirPool(contrasenasCandidatas[0]);

// El resto del proyecto sigue usando "mysqlPool.query(...)" o
// "mysqlPool.getConnection()" exactamente igual que antes: este
// Proxy solo reenvía esas llamadas al pool que haya quedado activo,
// sin que ningún otro archivo se tenga que enterar ni cambiar.
const mysqlPool = new Proxy({}, {
    get(_objetivo, propiedad) {
        const valor = poolActivo[propiedad];
        return typeof valor === 'function' ? valor.bind(poolActivo) : valor;
    }
});

async function connectMySQL() {

    let ultimoError = null;

    for (const password of contrasenasCandidatas) {

        const intento = construirPool(password);

        try {
            const connection = await intento.getConnection();
            connection.release();

            poolActivo = intento;
            console.log('Conexión exitosa a MYSQL');
            return;

        } catch (error) {
            ultimoError = error;

            // Si el error no es de usuario/contraseña, no tiene caso
            // seguir probando con la siguiente contraseña.
            if (error.code !== 'ER_ACCESS_DENIED_ERROR') {
                break;
            }
        }
    }

    console.error('Error al conectar con MYSQL: ', ultimoError && ultimoError.message);
    throw ultimoError;
}

module.exports = { mysqlPool, connectMySQL };