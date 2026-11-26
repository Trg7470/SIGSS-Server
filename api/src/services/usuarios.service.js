const { mysqlPool } = require('../config/mysql');
const Usuarios = require('../models/usuarios.model');
const Prestadores = require('../models/prestadores.model');
const Bitacora = require('../models/bitacora.model');
const Utils = require('../utils/utils');
const UNIDAD_CESSA_DEFAULT = 8;
const ID_ROL_MEDICO = 1;

class UsuariosService {
    static async listar(filtros) {
        return Usuarios.listar(filtros);
    }

    static async obtener_por_id(id_usuario) {
        return Usuarios.obtener_por_id(id_usuario);
    }

    static async buscar_por_nombre_usuario(nombre_usuario) {
        return Usuarios.buscar_por_nombre_usuario(nombre_usuario);
    }

    static async crear(datos, id_usuario_actual) {
        const connection = await mysqlPool.getConnection();

        try {
            await connection.beginTransaction();

            const existente = await Usuarios.buscar_por_nombre_usuario(datos.nombre_usuario, connection);
            if (existente) {
                throw Object.assign(new Error('Ese nombre de usuario ya existe'), { status: 409 });
            }

            const resultado = await Usuarios.crear(
                { ...datos, unidades_id_unidad: UNIDAD_CESSA_DEFAULT },
                connection
            );

            if (Number(datos.roles_id_rol) === ID_ROL_MEDICO) {
                await Prestadores.registrar(
                    {
                        cat_tipo_personal_id_tipo_personal: datos.cat_tipo_personal_id_tipo_personal,
                        unidades_id_unidad: UNIDAD_CESSA_DEFAULT,
                        curp: datos.curp,
                        nombre: datos.nombre,
                        apellido_paterno: datos.apellido_paterno,
                        apellido_materno: datos.apellido_materno,
                        cedula_profesional: datos.cedula_profesional,
                        usuarios_id_usuario: resultado.id_usuario
                    },
                    connection
                );
            }

            await Bitacora.registrar(
                id_usuario_actual,
                'Crear usuario',
                Utils.MODULOS_BITACORA.USUARIOS,
                'Usuarios',
                connection
            );

            await connection.commit();
            return resultado;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async actualizar(id_usuario, datos, id_usuario_actual) {
        const connection = await mysqlPool.getConnection();

        try {
            await connection.beginTransaction();

            if (datos.nombre_usuario) {
                const existente = await Usuarios.buscar_por_nombre_usuario(datos.nombre_usuario, connection);
                if (existente && String(existente.Id_Usuario) !== String(id_usuario)) {
                    throw Object.assign(new Error('Ese nombre de usuario ya existe'), { status: 409 });
                }
            }

            const resultado = await Usuarios.actualizar(
                id_usuario,
                { ...datos, unidades_id_unidad: UNIDAD_CESSA_DEFAULT },
                connection
            );

            if (!resultado.success) {
                throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
            }

            await Bitacora.registrar(
                id_usuario_actual,
                'Actualizar usuario',
                Utils.MODULOS_BITACORA.USUARIOS,
                'Usuarios',
                connection
            );

            await connection.commit();
            return resultado;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async cambiar_estado(id_usuario, activo, id_usuario_actual) {
        const connection = await mysqlPool.getConnection();

        try {
            await connection.beginTransaction();

            const resultado = await Usuarios.cambiar_estado(id_usuario, activo, connection);

            if (!resultado.success) {
                throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
            }

            await Bitacora.registrar(
                id_usuario_actual,
                activo ? 'Activar usuario' : 'Desactivar usuario',
                Utils.MODULOS_BITACORA.USUARIOS,
                'Usuarios',
                connection
            );

            await connection.commit();
            return resultado;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async cambiar_contrasena(id_usuario, contrasena_hash, id_usuario_actual) {
        const connection = await mysqlPool.getConnection();

        try {
            await connection.beginTransaction();

            const resultado = await Usuarios.cambiar_contrasena(id_usuario, contrasena_hash, connection);

            if (!resultado.success) {
                throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });
            }

            await Bitacora.registrar(
                id_usuario_actual,
                'Cambiar contraseña',
                Utils.MODULOS_BITACORA.USUARIOS,
                'Usuarios',
                connection
            );

            await connection.commit();
            return resultado;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}

module.exports = UsuariosService;