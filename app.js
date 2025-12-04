const express = require('express');
const app = express();
const eventoRoutes = require('./routes/eventoRoutes');
const participanteRoutes = require('./routes/participanteRoutes');
const atividadeRoutes = require('./routes/atividadeRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/eventos', eventoRoutes);
app.use('/participantes', participanteRoutes);
app.use('/atividades', atividadeRoutes);

app.get('/', (req, res) => {
  res.send('API Projeto Integrador - Gestão de Eventos');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
