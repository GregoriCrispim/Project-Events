const { Atividade, Participante } = require('../models');

module.exports = {
  async listarAtividades(req, res) {
    try {
      const atividades = await Atividade.findAll();
      res.json(atividades);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async detalharAtividade(req, res) {
    try {
      const atividade = await Atividade.findByPk(req.params.id);
      if (!atividade) return res.status(404).json({ error: 'Atividade não encontrada' });
      res.json(atividade);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async criarAtividade(req, res) {
    try {
      const atividade = await Atividade.create(req.body);
      res.status(201).json(atividade);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async atualizarAtividade(req, res) {
    try {
      const atividade = await Atividade.findByPk(req.params.id);
      if (!atividade) return res.status(404).json({ error: 'Atividade não encontrada' });
      await atividade.update(req.body);
      res.json(atividade);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async removerAtividade(req, res) {
    try {
      const atividade = await Atividade.findByPk(req.params.id);
      if (!atividade) return res.status(404).json({ error: 'Atividade não encontrada' });
      await atividade.destroy();
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async detalharResponsavel(req, res) {
    try {
      const atividade = await Atividade.findByPk(req.params.id, {
        include: [{ model: Participante, as: 'responsavel' }]
      });
      if (!atividade) return res.status(404).json({ error: 'Atividade não encontrada' });
      res.json(atividade.responsavel);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async definirResponsavel(req, res) {
    try {
      const atividade = await Atividade.findByPk(req.params.id);
      const participante = await Participante.findByPk(req.body.responsavelId);
      if (!atividade || !participante) return res.status(404).json({ error: 'Atividade ou participante não encontrado' });
      atividade.ResponsavelId = participante.id;
      await atividade.save();
      res.json({ message: 'Responsável definido com sucesso' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
