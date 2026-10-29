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

module.exports = {
    verificarToken
};