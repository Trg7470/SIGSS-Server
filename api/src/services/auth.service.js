const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/auth.model');
const Bitacora = require('../models/bitacora.model');
const Prestador = require('../models/prestadores.model');

class AuthService {
    static async login(user, password) {
        const resultado = await Usuario.login(user);

        if (!resultado.success || !resultado.user) {
            throw new Error('Credenciales inválidas.');
        }

        const usuario = await resultado.user;

        if (!usuario.Activo) {
            throw new Error('El usuario se encuentra inactivo. Por favor, contacte al administrador del sistema.');
        }

        const password_valida = await bcrypt.compare(
            password,
            usuario.Password
        );

        if (!password_valida) {
            throw new Error('Credenciales inválidas.');
        }
        const resultado_p = await Prestador.por_usuario(usuario.Id_Usuario);
        if (!resultado_p || resultado_p.length === 0) {
            throw new Error('No se encontró un prestador asociado a este usuario.');
        }
        const prestador = await resultado_p;
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
        const resultado_b = await Bitacora.registrar(usuario.Id_Usuario, 'Inicio de Sesión', 'Login', null);
        if(!resultado_b.success)
        {
            throw new Error('Error al registrar el evento en la bitacora.');
        }
        return {
            token,
           usuario: {
        Id_Usuario: usuario.Id_Usuario,
        Id_Prestador: prestador.Id_Prestador,
        Nombre: usuario.Nombre,
        Apellido_Paterno: usuario.Apellido_Paterno,
        Apellido_Materno: usuario.Apellido_Materno,
        Usuario: usuario.Nombre_Usuario,
        Id_Rol: usuario.Id_Rol,
        Rol: usuario.Rol,
        Clues: prestador.CLUES,
        Curp: prestador.Curp,
        Tipo_Personal: prestador.Tipo_Personal,
        Nombre_Unidad: prestador.Nombre_Unidad,
        Area: prestador.Area,
        Municipio: prestador.Municipio,
        Id_Unidad: prestador.Id_Unidad,
        Cedula_Profesional: prestador.Cedula_Profesional
    }
        };
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 12);
    }
}

module.exports = AuthService;