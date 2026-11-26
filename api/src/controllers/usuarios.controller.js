const bcrypt = require('bcryptjs');
const UsuariosService = require('../services/usuarios.service');

class UsuariosController {
    static async listar(req, res) {
        try {
            const { rol, activo, busqueda, pagina, por_pagina } = req.query;

            const filtros = {
                roles_id_rol: rol || undefined,
                activo: activo === '1' ? true : activo === '0' ? false : undefined,
                busqueda: busqueda || undefined,
                pagina: pagina ? Number(pagina) : 1,
                por_pagina: por_pagina ? Number(por_pagina) : 10
            };

            const { usuarios, total } = await UsuariosService.listar(filtros);
            res.json({
                success: true,
                data: usuarios,
                total,
                pagina: filtros.pagina,
                por_pagina: filtros.por_pagina
            });
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ success: false, error: 'Error al obtener usuarios' });
        }
    }

    static async obtener_por_id(req, res) {
        try {
            const { id } = req.params;
            const usuario = await UsuariosService.obtener_por_id(id);

            if (!usuario) {
                return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
            }
            res.json({ success: true, data: usuario });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({ success: false, error: 'Error al obtener usuario' });
        }
    }

    static async crear(req, res) {
        try {
            const datos = req.body;

            if (!datos.nombre || !datos.apellido_paterno || !datos.apellido_materno ||
                !datos.nombre_usuario || !datos.contrasena || !datos.roles_id_rol) {
                return res.status(400).json({ success: false, error: 'Faltan datos requeridos' });
            }

            // Médico (Id_Rol = 1) también da de alta su Prestador: estos datos
            // son obligatorios solo para ese rol (ver usuarios.service.js).
            if (Number(datos.roles_id_rol) === 1 &&
                (!datos.curp || !datos.cedula_profesional || !datos.cat_tipo_personal_id_tipo_personal)) {
                return res.status(400).json({
                    success: false,
                    error: 'Para el rol Médico, CURP, Cédula profesional y Tipo de personal son obligatorios'
                });
            }

            const salt = await bcrypt.genSalt(10);
            datos.contrasena = await bcrypt.hash(datos.contrasena, salt);

            const resultado = await UsuariosService.crear(datos, req.usuario.Id_Usuario);
            res.status(201).json(resultado);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ success: false, error: error.message });
            }
            console.error('Error al crear usuario:', error);
            res.status(500).json({ success: false, error: 'Error al crear usuario' });
        }
    }

    static async actualizar(req, res) {
        try {
            const { id } = req.params;
            const resultado = await UsuariosService.actualizar(id, req.body, req.usuario.Id_Usuario);
            res.json(resultado);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ success: false, error: error.message });
            }
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({ success: false, error: 'Error al actualizar usuario' });
        }
    }

    static async cambiar_estado(req, res) {
        try {
            const { id } = req.params;
            const { activo } = req.body;

            if (typeof activo !== 'boolean') {
                return res.status(400).json({ success: false, error: 'El campo "activo" debe ser booleano' });
            }

            const resultado = await UsuariosService.cambiar_estado(id, activo, req.usuario.Id_Usuario);
            res.json(resultado);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ success: false, error: error.message });
            }
            console.error('Error al cambiar estado del usuario:', error);
            res.status(500).json({ success: false, error: 'Error al cambiar estado del usuario' });
        }
    }

    static async generar_contrasena(req, res) {
        try {
            const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!';
            let contrasena = '';
            for (let i = 0; i < 12; i++) {
                contrasena += caracteres[Math.floor(Math.random() * caracteres.length)];
            }
            res.json({ success: true, contrasena });
        } catch (error) {
            console.error('Error al generar contraseña:', error);
            res.status(500).json({ success: false, error: 'Error al generar contraseña' });
        }
    }

    static async cambiar_contrasena(req, res) {
        try {
            const { id } = req.params;
            const { contrasena } = req.body;

            if (!contrasena || contrasena.length < 8) {
                return res.status(400).json({
                    success: false,
                    error: 'La contraseña debe tener al menos 8 caracteres'
                });
            }

            const salt = await bcrypt.genSalt(10);
            const contrasena_hash = await bcrypt.hash(contrasena, salt);

            const resultado = await UsuariosService.cambiar_contrasena(id, contrasena_hash, req.usuario.Id_Usuario);
            res.json(resultado);
        } catch (error) {
            if (error.status) {
                return res.status(error.status).json({ success: false, error: error.message });
            }
            console.error('Error al cambiar contraseña:', error);
            res.status(500).json({ success: false, error: 'Error al cambiar contraseña' });
        }
    }
}

module.exports = UsuariosController;