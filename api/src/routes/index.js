const express = require('express');
const router = express.Router();

const AuthRoutes = require('./auth.routes');
const DocumentosRoutes = require('./documentos.routes');

router.use('/auth', AuthRoutes);
router.use('/documentos', DocumentosRoutes);

module.exports = router;
