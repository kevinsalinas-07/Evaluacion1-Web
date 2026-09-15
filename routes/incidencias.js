const express = require('express');
const router = express.Router();
const { registrarIncidencia, listarIncidencias } = require('../controllers/incidenciasController');

router.post('/incidencias', registrarIncidencia);
router.get('/incidencias', listarIncidencias);

module.exports = router;