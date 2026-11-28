class Utils {
    static tiene_datos(objeto) {
        return objeto && Object.values(objeto).some(valor => valor !== null && valor !== undefined);
    }
    static get MODULOS_BITACORA() {
        return {
            PACIENTES: 'pacientes',
            CONSULTA_EXTERNA: 'consulta-externa',
            SALUD_BUCAL: 'salud-bucal',
            PLANIFICACION_FAMILIAR: 'planificacion-familiar',
            DETECCIONES: 'detecciones',
            REPORTES: 'reportes',
            USUARIOS: 'usuarios',
            SESION: 'sesion'
        };
    }
}

module.exports = Utils;