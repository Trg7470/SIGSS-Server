const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                mensaje: 'Sesión no autenticada'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
}
function verificarRol(...roles_permitidos) {
    return (req, res, next) => {
        if (!req.usuario || !roles_permitidos.includes(req.usuario.Id_Rol)) {
            return res.status(403).json({ mensaje: 'No tienes permisos para esta acción' });
        }
        next();
    };
}

module.exports = {
    verificarToken,
    verificarRol
};