const express = require('express');
const router = express.Router();
const participanteController = require('../controllers/participanteController');
const { autenticarToken } = require('../middlewares/auth');

router.get('/', participanteController.listarParticipantes);
router.get('/:id', participanteController.detalharParticipante);
router.post('/', participanteController.criarParticipante);
router.put('/:id', participanteController.atualizarParticipante);
router.delete('/:id', participanteController.removerParticipante);

module.exports = router;
