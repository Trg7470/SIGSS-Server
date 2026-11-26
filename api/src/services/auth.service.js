const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { mysqlPool } = require('../config/mysql');
const Utils = require('../utils/utils');
const Usuario = require('../models/auth.model');
const Usuarios = require('../models/usuarios.model');
const Bitacora = require('../models/bitacora.model');
const Prestador = require('../models/prestadores.model');
const ROLES_QUE_REQUIEREN_PRESTADOR = [1];

class AuthService {
    static async login(user, password) {
        const connection = await mysqlPool.getConnection();

        try {
            const resultado = await Usuario.login(user);

            if (!resultado.success || !resultado.user) {
                throw new Error('Credenciales inválidas.');
            }

            const usuario = await resultado.user;

            const password_valida = await bcrypt.compare(
                password,
                usuario.Password
            );

            if (!password_valida) {
                throw new Error('Credenciales inválidas.');
            }

            if (!usuario.Activo) {
                throw new Error('El usuario se encuentra inactivo. Por favor, contacte al administrador del sistema.');
            }

            const prestador = (await Prestador.por_usuario(usuario.Id_Usuario)) || null;

            if (!prestador && ROLES_QUE_REQUIEREN_PRESTADOR.includes(usuario.Id_Rol)) {
                throw new Error('No se encontró un prestador asociado a este usuario.');
            }

            const payload = {
                Id_Usuario: usuario.Id_Usuario,
                Usuario: usuario.Nombre_Usuario,
                Id_Rol: usuario.Id_Rol
            };

            const token = jwt.sign(
                payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN || '6h'
                }
            );

            try {
                const resultado_b = await Bitacora.registrar(usuario.Id_Usuario, 'Inicio de sesión', Utils.MODULOS_BITACORA.SESION, null, connection);

                if (!resultado_b.success) {
                    console.error('No se pudo registrar el inicio de sesión en la bitácora.');
                }
            } catch (error) {
                console.error('Error al registrar el evento en la bitácora:', error);
            }

            try {
                const resultado_a = await Usuarios.registrar_acceso(usuario.Id_Usuario, connection);

                if (!resultado_a.success) {
                    console.error('No se pudo registrar el acceso del usuario.');
                }
            } catch (error) {
                console.error('Error al registrar el acceso del usuario:', error);
            }

            return {
                token,
                usuario: {
                    Id_Usuario: usuario.Id_Usuario,
                    Id_Prestador: prestador?.Id_Prestador ?? null,
                    Nombre: usuario.Nombre,
                    Apellido_Paterno: usuario.Apellido_Paterno,
                    Apellido_Materno: usuario.Apellido_Materno,
                    Usuario: usuario.Nombre_Usuario,
                    Id_Rol: usuario.Id_Rol,
                    Rol: usuario.Rol,
                    Clues: prestador?.CLUES ?? null,
                    Curp: prestador?.Curp ?? null,
                    Tipo_Personal: prestador?.Tipo_Personal ?? null,
                    Nombre_Unidad: prestador?.Nombre_Unidad ?? null,
                    Area: prestador?.Area ?? null,
                    Municipio: prestador?.Municipio ?? null,
                    Id_Unidad: prestador?.Id_Unidad ?? null,
                    Cedula_Profesional: prestador?.Cedula_Profesional ?? null
                }
            };
        } finally {
            connection.release();
        }
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }
}

module.exports = AuthService;