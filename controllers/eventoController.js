const { Evento, Participante, Atividade, EventoParticipante } = require('../models');

module.exports = {
  async listarEventos(req, res) {
    try {
      const eventos = await Evento.findAll();
      res.json(eventos);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async detalharEvento(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
      res.json(evento);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async criarEvento(req, res) {
    try {
      const evento = await Evento.create(req.body);
      res.status(201).json(evento);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async atualizarEvento(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
      await evento.update(req.body);
      res.json(evento);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async removerEvento(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
      await evento.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async listarAtividadesDoEvento(req, res) {
    try {
      const atividades = await Atividade.findAll({ where: { EventoId: req.params.id } });
      res.json(atividades);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async criarAtividadeNoEvento(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id);
      if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
      const atividade = await Atividade.create({ ...req.body, EventoId: evento.id });
      res.status(201).json(atividade);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async listarParticipantesDoEvento(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id, {
        include: [{ model: Participante, through: { attributes: [] } }]
      });
      if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
      res.json(evento.Participantes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async inscreverParticipanteNoEvento(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id);
      const participante = await Participante.findByPk(req.body.participanteId);
      if (!evento || !participante) return res.status(404).json({ error: 'Evento ou participante não encontrado' });
      await evento.addParticipante(participante);
      res.status(201).json({ message: 'Participante inscrito com sucesso' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async dashboardEvento(req, res) {
    try {
      const evento = await Evento.findByPk(req.params.id, {
        include: [
          {
            model: Atividade,
            include: [{ model: Participante, as: 'responsavel' }]
          },
          {
            model: Participante,
            through: { attributes: [] }
          }
        ]
      });
      if (!evento) return res.status(404).json({ error: 'Evento não encontrado' });
      res.json(evento);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
