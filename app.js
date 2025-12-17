const express = require('express');
const path = require('path');
const app = express();
const eventoRoutes = require('./routes/eventoRoutes');
const participanteRoutes = require('./routes/participanteRoutes');
const atividadeRoutes = require('./routes/atividadeRoutes');
const authRoutes = require('./routes/authRoutes');
const uiRoutes = require('./routes/uiRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Views (UI interna para testar a API sem Postman)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/eventos', eventoRoutes);
app.use('/participantes', participanteRoutes);
app.use('/atividades', atividadeRoutes);
app.use('/ui', uiRoutes);

app.get('/', (req, res) => {
  res
    .status(200)
    .type('html')
    .send(
      [
        '<!doctype html>',
        '<html lang="pt-BR">',
        '<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">',
        '<title>API - Gestão de Eventos</title></head>',
        '<body style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; padding: 24px;">',
        '<h2 style="margin: 0 0 10px;">API Projeto Integrador - Gestão de Eventos</h2>',
        '<p style="margin: 0 0 16px; color: #444;">A API está ativa. Para testar sem Postman, use a interface web:</p>',
        '<p style="margin: 0;"><a href="/ui" style="font-weight: 600;">Abrir UI / Playground</a></p>',
        '</body></html>',
      ].join('')
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
