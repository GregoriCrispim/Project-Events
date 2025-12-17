const express = require('express');
const path = require('path');
const app = express();
const eventoRoutes = require('./routes/eventoRoutes');
const participanteRoutes = require('./routes/participanteRoutes');
const atividadeRoutes = require('./routes/atividadeRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve React app (static files)
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/auth', authRoutes);
app.use('/eventos', eventoRoutes);
app.use('/participantes', participanteRoutes);
app.use('/atividades', atividadeRoutes);

// SPA fallback - serve React app for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
