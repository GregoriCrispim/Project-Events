const express = require('express');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middlewares/auth');
const router = express.Router();

// Rota de login simples (exemplo)
router.post('/login', (req, res) => {
  const { email } = req.body;
  // No real, buscar usuário no banco e validar senha
  if (!email) return res.status(400).json({ error: 'Email obrigatório' });
  // Usuário fictício
  const usuario = { email };
  const token = jwt.sign(usuario, SECRET, { expiresIn: '2h' });
  res.json({ token });
});

module.exports = router;
