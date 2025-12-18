const { Participante } = require('../models');

module.exports = {
  async listarParticipantes(req, res) {
    try {
      const participantes = await Participante.findAll();
      res.json(participantes);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async detalharParticipante(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const participante = await Participante.findByPk(id);
      if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });
      res.json(participante);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async criarParticipante(req, res) {
    try {
      const participante = await Participante.create(req.body);
      res.status(201).json(participante);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async atualizarParticipante(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const participante = await Participante.findByPk(id);
      if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });
      await participante.update(req.body);
      res.json(participante);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async removerParticipante(req, res) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
      const participante = await Participante.findByPk(id);
      if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });
      await participante.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
