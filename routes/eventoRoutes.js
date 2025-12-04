const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');
const { autenticarToken } = require('../middlewares/auth');

// Rotas públicas
router.get('/', eventoController.listarEventos); // Listar todos eventos
router.get('/:id', eventoController.detalharEvento); // Detalhar evento

// Rotas protegidas
router.post('/', autenticarToken, eventoController.criarEvento); // Criar evento
router.put('/:id', autenticarToken, eventoController.atualizarEvento); // Atualizar evento
router.delete('/:id', autenticarToken, eventoController.removerEvento); // Remover evento

// Relacionamentos
router.get('/:id/atividades', eventoController.listarAtividadesDoEvento); // Listar atividades de um evento
router.post('/:id/atividades', autenticarToken, eventoController.criarAtividadeNoEvento); // Criar atividade em evento
router.get('/:id/participantes', eventoController.listarParticipantesDoEvento); // Listar participantes de um evento
router.post('/:id/participantes', autenticarToken, eventoController.inscreverParticipanteNoEvento); // Inscrever participante em evento
router.get('/:id/dashboard', eventoController.dashboardEvento); // Rota composta

module.exports = router;
