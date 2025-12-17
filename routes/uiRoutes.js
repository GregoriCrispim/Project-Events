const express = require('express');

const router = express.Router();

const endpoints = [
  // Auth
  {
    key: 'auth-login',
    group: 'Auth',
    title: 'Login (JWT)',
    description: 'Gera um token JWT usando apenas o email (login simples do projeto).',
    uiPath: '/auth/login',
    api: { method: 'POST', path: '/auth/login', auth: false },
    fields: [{ name: 'email', label: 'Email', type: 'email', required: true, where: 'body', placeholder: 'voce@exemplo.com' }],
    storeTokenFrom: 'token',
  },

  // Eventos
  { key: 'eventos-listar', group: 'Eventos', title: 'Listar eventos', uiPath: '/eventos', api: { method: 'GET', path: '/eventos', auth: false }, fields: [] },
  {
    key: 'eventos-detalhar',
    group: 'Eventos',
    title: 'Detalhar evento',
    uiPath: '/eventos/detalhar',
    api: { method: 'GET', path: '/eventos/:id', auth: false },
    fields: [{ name: 'id', label: 'ID do evento', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },
  {
    key: 'eventos-criar',
    group: 'Eventos',
    title: 'Criar evento (JWT)',
    uiPath: '/eventos/criar',
    api: { method: 'POST', path: '/eventos', auth: true },
    fields: [
      { name: 'nome', label: 'Nome', type: 'text', required: true, where: 'body' },
      { name: 'descricao', label: 'Descrição', type: 'textarea', required: false, where: 'body' },
      { name: 'data_inicio', label: 'Data início', type: 'datetime-local', required: false, where: 'body' },
      { name: 'data_fim', label: 'Data fim', type: 'datetime-local', required: false, where: 'body' },
      { name: 'local', label: 'Local', type: 'text', required: false, where: 'body' },
    ],
  },
  {
    key: 'eventos-atualizar',
    group: 'Eventos',
    title: 'Atualizar evento (JWT)',
    uiPath: '/eventos/atualizar',
    api: { method: 'PUT', path: '/eventos/:id', auth: true },
    fields: [
      { name: 'id', label: 'ID do evento', type: 'number', required: true, where: 'path', placeholder: '1' },
      { name: 'nome', label: 'Nome', type: 'text', required: false, where: 'body' },
      { name: 'descricao', label: 'Descrição', type: 'textarea', required: false, where: 'body' },
      { name: 'data_inicio', label: 'Data início', type: 'datetime-local', required: false, where: 'body' },
      { name: 'data_fim', label: 'Data fim', type: 'datetime-local', required: false, where: 'body' },
      { name: 'local', label: 'Local', type: 'text', required: false, where: 'body' },
    ],
  },
  {
    key: 'eventos-remover',
    group: 'Eventos',
    title: 'Remover evento (JWT)',
    uiPath: '/eventos/remover',
    api: { method: 'DELETE', path: '/eventos/:id', auth: true },
    fields: [{ name: 'id', label: 'ID do evento', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },
  {
    key: 'eventos-atividades-listar',
    group: 'Eventos',
    title: 'Listar atividades do evento',
    uiPath: '/eventos/atividades',
    api: { method: 'GET', path: '/eventos/:id/atividades', auth: false },
    fields: [{ name: 'id', label: 'ID do evento', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },
  {
    key: 'eventos-atividades-criar',
    group: 'Eventos',
    title: 'Criar atividade no evento (JWT)',
    uiPath: '/eventos/atividades/criar',
    api: { method: 'POST', path: '/eventos/:id/atividades', auth: true },
    fields: [
      { name: 'id', label: 'ID do evento', type: 'number', required: true, where: 'path', placeholder: '1' },
      { name: 'titulo', label: 'Título', type: 'text', required: true, where: 'body' },
      { name: 'descricao', label: 'Descrição', type: 'textarea', required: false, where: 'body' },
      { name: 'horario_inicio', label: 'Horário início', type: 'datetime-local', required: false, where: 'body' },
      { name: 'horario_fim', label: 'Horário fim', type: 'datetime-local', required: false, where: 'body' },
      { name: 'tipo', label: 'Tipo', type: 'text', required: false, where: 'body', placeholder: 'workshop/palestra/oficina...' },
    ],
  },
  {
    key: 'eventos-participantes-listar',
    group: 'Eventos',
    title: 'Listar participantes do evento',
    uiPath: '/eventos/participantes',
    api: { method: 'GET', path: '/eventos/:id/participantes', auth: false },
    fields: [{ name: 'id', label: 'ID do evento', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },
  {
    key: 'eventos-participantes-inscrever',
    group: 'Eventos',
    title: 'Inscrever participante no evento (JWT)',
    uiPath: '/eventos/participantes/inscrever',
    api: { method: 'POST', path: '/eventos/:id/participantes', auth: true },
    fields: [
      { name: 'id', label: 'ID do evento', type: 'number', required: true, where: 'path', placeholder: '1' },
      { name: 'participanteId', label: 'ID do participante', type: 'number', required: true, where: 'body', placeholder: '1' },
    ],
  },
  {
    key: 'eventos-dashboard',
    group: 'Eventos',
    title: 'Dashboard do evento',
    uiPath: '/eventos/dashboard',
    api: { method: 'GET', path: '/eventos/:id/dashboard', auth: false },
    fields: [{ name: 'id', label: 'ID do evento', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },

  // Participantes
  { key: 'participantes-listar', group: 'Participantes', title: 'Listar participantes', uiPath: '/participantes', api: { method: 'GET', path: '/participantes', auth: false }, fields: [] },
  {
    key: 'participantes-detalhar',
    group: 'Participantes',
    title: 'Detalhar participante',
    uiPath: '/participantes/detalhar',
    api: { method: 'GET', path: '/participantes/:id', auth: false },
    fields: [{ name: 'id', label: 'ID do participante', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },
  {
    key: 'participantes-criar',
    group: 'Participantes',
    title: 'Criar participante',
    uiPath: '/participantes/criar',
    api: { method: 'POST', path: '/participantes', auth: false },
    fields: [
      { name: 'nome', label: 'Nome', type: 'text', required: true, where: 'body' },
      { name: 'email', label: 'Email', type: 'email', required: true, where: 'body' },
      { name: 'celular', label: 'Celular', type: 'text', required: false, where: 'body', placeholder: '61999999999' },
      { name: 'tipo', label: 'Tipo', type: 'text', required: false, where: 'body', placeholder: 'visitante/palestrante...' },
    ],
  },
  {
    key: 'participantes-atualizar',
    group: 'Participantes',
    title: 'Atualizar participante',
    uiPath: '/participantes/atualizar',
    api: { method: 'PUT', path: '/participantes/:id', auth: false },
    fields: [
      { name: 'id', label: 'ID do participante', type: 'number', required: true, where: 'path', placeholder: '1' },
      { name: 'nome', label: 'Nome', type: 'text', required: false, where: 'body' },
      { name: 'email', label: 'Email', type: 'email', required: false, where: 'body' },
      { name: 'celular', label: 'Celular', type: 'text', required: false, where: 'body' },
      { name: 'tipo', label: 'Tipo', type: 'text', required: false, where: 'body' },
    ],
  },
  {
    key: 'participantes-remover',
    group: 'Participantes',
    title: 'Remover participante',
    uiPath: '/participantes/remover',
    api: { method: 'DELETE', path: '/participantes/:id', auth: false },
    fields: [{ name: 'id', label: 'ID do participante', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },

  // Atividades
  { key: 'atividades-listar', group: 'Atividades', title: 'Listar atividades', uiPath: '/atividades', api: { method: 'GET', path: '/atividades', auth: false }, fields: [] },
  {
    key: 'atividades-detalhar',
    group: 'Atividades',
    title: 'Detalhar atividade',
    uiPath: '/atividades/detalhar',
    api: { method: 'GET', path: '/atividades/:id', auth: false },
    fields: [{ name: 'id', label: 'ID da atividade', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },
  {
    key: 'atividades-criar',
    group: 'Atividades',
    title: 'Criar atividade (JWT)',
    uiPath: '/atividades/criar',
    api: { method: 'POST', path: '/atividades', auth: true },
    fields: [
      { name: 'titulo', label: 'Título', type: 'text', required: true, where: 'body' },
      { name: 'descricao', label: 'Descrição', type: 'textarea', required: false, where: 'body' },
      { name: 'horario_inicio', label: 'Horário início', type: 'datetime-local', required: false, where: 'body' },
      { name: 'horario_fim', label: 'Horário fim', type: 'datetime-local', required: false, where: 'body' },
      { name: 'tipo', label: 'Tipo', type: 'text', required: false, where: 'body' },
      { name: 'EventoId', label: 'EventoId', type: 'number', required: false, where: 'body', placeholder: '1' },
      { name: 'ResponsavelId', label: 'ResponsavelId', type: 'number', required: false, where: 'body', placeholder: '1' },
    ],
  },
  {
    key: 'atividades-atualizar',
    group: 'Atividades',
    title: 'Atualizar atividade (JWT)',
    uiPath: '/atividades/atualizar',
    api: { method: 'PUT', path: '/atividades/:id', auth: true },
    fields: [
      { name: 'id', label: 'ID da atividade', type: 'number', required: true, where: 'path', placeholder: '1' },
      { name: 'titulo', label: 'Título', type: 'text', required: false, where: 'body' },
      { name: 'descricao', label: 'Descrição', type: 'textarea', required: false, where: 'body' },
      { name: 'horario_inicio', label: 'Horário início', type: 'datetime-local', required: false, where: 'body' },
      { name: 'horario_fim', label: 'Horário fim', type: 'datetime-local', required: false, where: 'body' },
      { name: 'tipo', label: 'Tipo', type: 'text', required: false, where: 'body' },
      { name: 'EventoId', label: 'EventoId', type: 'number', required: false, where: 'body' },
      { name: 'ResponsavelId', label: 'ResponsavelId', type: 'number', required: false, where: 'body' },
    ],
  },
  {
    key: 'atividades-remover',
    group: 'Atividades',
    title: 'Remover atividade (JWT)',
    uiPath: '/atividades/remover',
    api: { method: 'DELETE', path: '/atividades/:id', auth: true },
    fields: [{ name: 'id', label: 'ID da atividade', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },
  {
    key: 'atividades-responsavel-detalhar',
    group: 'Atividades',
    title: 'Consultar responsável',
    uiPath: '/atividades/responsavel',
    api: { method: 'GET', path: '/atividades/:id/responsavel', auth: false },
    fields: [{ name: 'id', label: 'ID da atividade', type: 'number', required: true, where: 'path', placeholder: '1' }],
  },
  {
    key: 'atividades-responsavel-definir',
    group: 'Atividades',
    title: 'Definir responsável (JWT)',
    uiPath: '/atividades/responsavel/definir',
    api: { method: 'PUT', path: '/atividades/:id/responsavel', auth: true },
    fields: [
      { name: 'id', label: 'ID da atividade', type: 'number', required: true, where: 'path', placeholder: '1' },
      { name: 'responsavelId', label: 'ID do responsável (Participante)', type: 'number', required: true, where: 'body', placeholder: '1' },
    ],
  },
];

function byUiPath(uiPath) {
  return endpoints.find(e => e.uiPath === uiPath);
}

function groupedEndpoints() {
  const groups = new Map();
  for (const e of endpoints) {
    if (!groups.has(e.group)) groups.set(e.group, []);
    groups.get(e.group).push(e);
  }
  return Array.from(groups.entries()).map(([name, items]) => ({ name, items }));
}

router.get('/', (req, res) => {
  res.render('ui/index', {
    appName: 'Gestão de Eventos',
    groups: groupedEndpoints(),
  });
});

// Cada rota da API vira uma view (sub-rotas em /ui/...)
for (const e of endpoints) {
  router.get(e.uiPath, (req, res) => {
    const endpoint = byUiPath(e.uiPath);
    res.render('ui/endpoint', {
      appName: 'Gestão de Eventos',
      endpoint,
    });
  });
}

module.exports = router;


