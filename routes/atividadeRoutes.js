const express = require('express');
const router = express.Router();
const atividadeController = require('../controllers/atividadeController');
const { autenticarToken } = require('../middlewares/auth');

router.get('/', atividadeController.listarAtividades);
router.get('/:id', atividadeController.detalharAtividade);
router.post('/', autenticarToken, atividadeController.criarAtividade);
router.put('/:id', autenticarToken, atividadeController.atualizarAtividade);
router.delete('/:id', autenticarToken, atividadeController.removerAtividade);

// Relacionamento responsável
router.get('/:id/responsavel', atividadeController.detalharResponsavel);
router.put('/:id/responsavel', autenticarToken, atividadeController.definirResponsavel);

module.exports = router;
