/* global window, document, navigator */
(() => {
  const qs = (sel) => document.querySelector(sel);
  const el = {
    connBadge: qs('#connBadge'),
    baseUrl: qs('#baseUrl'),
    saveBaseUrl: qs('#saveBaseUrl'),
    loginEmail: qs('#loginEmail'),
    btnLogin: qs('#btnLogin'),
    jwtToken: qs('#jwtToken'),
    useToken: qs('#useToken'),
    copyToken: qs('#copyToken'),
    clearToken: qs('#clearToken'),
    presetSelect: qs('#presetSelect'),
    applyPreset: qs('#applyPreset'),
    applyPresetAndSend: qs('#applyPresetAndSend'),
    method: qs('#method'),
    path: qs('#path'),
    headers: qs('#headers'),
    body: qs('#body'),
    beautifyJson: qs('#beautifyJson'),
    clearBody: qs('#clearBody'),
    sendReq: qs('#sendReq'),
    respMeta: qs('#respMeta'),
    responseBox: qs('#responseBox'),
    copyResponse: qs('#copyResponse'),
    clearResponse: qs('#clearResponse'),
    history: qs('#history'),
    clearHistory: qs('#clearHistory'),
  };

  const storage = {
    get(key, fallback) {
      try {
        const raw = localStorage.getItem(key);
        return raw == null ? fallback : JSON.parse(raw);
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        // ignore
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };

  const LS = {
    baseUrl: 'apiPlayground.baseUrl',
    token: 'apiPlayground.jwt',
    useToken: 'apiPlayground.useToken',
    headers: 'apiPlayground.headers',
    history: 'apiPlayground.history',
    lastReq: 'apiPlayground.lastReq',
  };

  const presets = [
    { label: 'GET /eventos (listar)', method: 'GET', path: 'eventos' },
    { label: 'GET /eventos/:id (detalhar)', method: 'GET', path: 'eventos/1' },
    {
      label: 'POST /eventos (criar) [JWT]',
      method: 'POST',
      path: 'eventos',
      body: {
        nome: 'Evento Exemplo',
        descricao: 'Um evento para testes via UI',
        data_inicio: new Date().toISOString(),
        data_fim: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        local: 'Auditório Principal',
      },
    },
    { label: 'PUT /eventos/:id (atualizar) [JWT]', method: 'PUT', path: 'eventos/1', body: { local: 'Sala 02' } },
    { label: 'DELETE /eventos/:id (remover) [JWT]', method: 'DELETE', path: 'eventos/1' },

    { label: 'GET /participantes (listar)', method: 'GET', path: 'participantes' },
    { label: 'GET /participantes/:id (detalhar)', method: 'GET', path: 'participantes/1' },
    {
      label: 'POST /participantes (criar)',
      method: 'POST',
      path: 'participantes',
      body: { nome: 'Participante 1', email: 'p1@exemplo.com', celular: '61999999999', tipo: 'visitante' },
    },
    {
      label: 'PUT /participantes/:id (atualizar)',
      method: 'PUT',
      path: 'participantes/1',
      body: { nome: 'Participante 1 (editado)' },
    },
    { label: 'DELETE /participantes/:id (remover)', method: 'DELETE', path: 'participantes/1' },

    { label: 'GET /atividades (listar)', method: 'GET', path: 'atividades' },
    { label: 'GET /atividades/:id (detalhar)', method: 'GET', path: 'atividades/1' },
    {
      label: 'POST /atividades (criar) [JWT]',
      method: 'POST',
      path: 'atividades',
      body: {
        titulo: 'Palestra Exemplo',
        descricao: 'Atividade criada via UI',
        horario_inicio: new Date().toISOString(),
        horario_fim: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        tipo: 'palestra',
        EventoId: 1,
      },
    },
    { label: 'PUT /atividades/:id (atualizar) [JWT]', method: 'PUT', path: 'atividades/1', body: { tipo: 'workshop' } },
    { label: 'DELETE /atividades/:id (remover) [JWT]', method: 'DELETE', path: 'atividades/1' },
    { label: 'GET /atividades/:id/responsavel', method: 'GET', path: 'atividades/1/responsavel' },
    {
      label: 'PUT /atividades/:id/responsavel [JWT]',
      method: 'PUT',
      path: 'atividades/1/responsavel',
      body: { responsavelId: 1 },
    },

    { label: 'GET /eventos/:id/atividades', method: 'GET', path: 'eventos/1/atividades' },
    {
      label: 'POST /eventos/:id/atividades [JWT]',
      method: 'POST',
      path: 'eventos/1/atividades',
      body: {
        titulo: 'Oficina Exemplo',
        descricao: 'Criada dentro do evento',
        horario_inicio: new Date().toISOString(),
        horario_fim: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        tipo: 'oficina',
      },
    },
    { label: 'GET /eventos/:id/participantes', method: 'GET', path: 'eventos/1/participantes' },
    {
      label: 'POST /eventos/:id/participantes [JWT]',
      method: 'POST',
      path: 'eventos/1/participantes',
      body: { participanteId: 1 },
    },
    { label: 'GET /eventos/:id/dashboard', method: 'GET', path: 'eventos/1/dashboard' },
  ];

  function setBadge(text, tone) {
    el.connBadge.textContent = text;
    el.connBadge.style.borderColor = tone === 'bad' ? 'rgba(255,120,120,.45)' : 'rgba(255,255,255,.14)';
    el.connBadge.style.background = tone === 'bad' ? 'rgba(255,120,120,.10)' : 'rgba(255,255,255,.10)';
  }

  function normalizeBaseUrl(input) {
    const s = (input || '').trim();
    if (!s) return '';
    return s.replace(/\/+$/, '');
  }

  function joinUrl(baseUrl, path) {
    const b = normalizeBaseUrl(baseUrl);
    const p = (path || '').trim().replace(/^\/+/, '');
    return `${b}/${p}`;
  }

  function safeJsonParse(text) {
    const t = (text || '').trim();
    if (!t) return { ok: true, value: null };
    try {
      return { ok: true, value: JSON.parse(t) };
    } catch (e) {
      return { ok: false, error: e };
    }
  }

  function prettyJson(value) {
    return JSON.stringify(value, null, 2);
  }

  function getToken() {
    return (el.jwtToken.value || '').trim();
  }

  function setToken(token) {
    el.jwtToken.value = token || '';
    storage.set(LS.token, el.jwtToken.value);
  }

  function loadFromStorage() {
    const defaultBaseUrl = window.__APP__?.apiBaseHint || '';
    el.baseUrl.value = storage.get(LS.baseUrl, defaultBaseUrl);
    el.jwtToken.value = storage.get(LS.token, '');
    el.useToken.checked = storage.get(LS.useToken, true);
    el.headers.value = storage.get(LS.headers, prettyJson({ 'Content-Type': 'application/json' }));

    const lastReq = storage.get(LS.lastReq, null);
    if (lastReq && typeof lastReq === 'object') {
      el.method.value = lastReq.method || 'GET';
      el.path.value = lastReq.path || 'eventos';
      el.body.value = lastReq.body || '';
    } else {
      el.method.value = 'GET';
      el.path.value = 'eventos';
      el.body.value = '';
    }

    renderHistory();
  }

  function initPresets() {
    el.presetSelect.innerHTML = '';
    presets.forEach((p, idx) => {
      const opt = document.createElement('option');
      opt.value = String(idx);
      opt.textContent = p.label;
      el.presetSelect.appendChild(opt);
    });
  }

  function applyPreset(doSend) {
    const idx = Number(el.presetSelect.value || '0');
    const p = presets[idx];
    if (!p) return;

    el.method.value = p.method;
    el.path.value = p.path;
    el.body.value = p.body ? prettyJson(p.body) : '';

    if (doSend) sendRequest();
  }

  function setResponse(meta, payload, isError) {
    el.respMeta.textContent = meta || '—';
    el.responseBox.textContent = payload || '';
    el.responseBox.style.borderColor = isError ? 'rgba(255,120,120,.35)' : 'rgba(255,255,255,.12)';
  }

  function addToHistory(entry) {
    const history = storage.get(LS.history, []);
    const next = [entry, ...history].slice(0, 20);
    storage.set(LS.history, next);
    renderHistory();
  }

  function renderHistory() {
    const history = storage.get(LS.history, []);
    el.history.innerHTML = '';

    if (!history.length) {
      el.history.innerHTML = '<div class="text-white-50 small">Sem histórico ainda.</div>';
      return;
    }

    history.forEach((h, idx) => {
      const wrap = document.createElement('div');
      wrap.className = 'history-item';

      const meta = document.createElement('div');
      meta.className = 'meta';

      const left = document.createElement('div');
      left.className = 'd-flex align-items-center gap-2 flex-wrap';
      const pill1 = document.createElement('div');
      pill1.className = 'pill mono';
      pill1.textContent = `${h.method} /${h.path}`;
      const pill2 = document.createElement('div');
      pill2.className = 'pill mono';
      pill2.textContent = `HTTP ${h.status}`;
      left.appendChild(pill1);
      left.appendChild(pill2);

      const right = document.createElement('div');
      right.className = 'd-flex gap-2';
      const btn = document.createElement('button');
      btn.className = 'btn btn-sm btn-outline-light';
      btn.type = 'button';
      btn.textContent = 'Reaplicar';
      btn.addEventListener('click', () => {
        el.method.value = h.method;
        el.path.value = h.path;
        el.headers.value = h.headers || el.headers.value;
        el.body.value = h.body || '';
        storage.set(LS.lastReq, { method: h.method, path: h.path, body: h.body || '' });
      });

      const btn2 = document.createElement('button');
      btn2.className = 'btn btn-sm btn-outline-light';
      btn2.type = 'button';
      btn2.textContent = 'Ver resposta';
      btn2.addEventListener('click', () => {
        setResponse(`${h.status} • ${h.ms}ms`, h.responseText || '', h.status >= 400);
      });

      right.appendChild(btn);
      right.appendChild(btn2);

      meta.appendChild(left);
      meta.appendChild(right);

      const small = document.createElement('div');
      small.className = 'text-white-50 small mt-2 mono';
      small.textContent = h.when;

      wrap.appendChild(meta);
      wrap.appendChild(small);
      el.history.appendChild(wrap);
    });
  }

  async function sendRequest() {
    const baseUrl = normalizeBaseUrl(el.baseUrl.value);
    if (!baseUrl) {
      setBadge('Base URL vazia', 'bad');
      return;
    }

    const method = (el.method.value || 'GET').toUpperCase();
    const path = (el.path.value || '').trim().replace(/^\/+/, '');
    if (!path) {
      setBadge('Path vazio', 'bad');
      return;
    }

    const headersParsed = safeJsonParse(el.headers.value);
    if (!headersParsed.ok) {
      setBadge('Headers JSON inválido', 'bad');
      setResponse('Erro', `Headers inválidos:\n${headersParsed.error}`, true);
      return;
    }

    const bodyParsed = safeJsonParse(el.body.value);
    if (!bodyParsed.ok) {
      setBadge('Body JSON inválido', 'bad');
      setResponse('Erro', `Body inválido:\n${bodyParsed.error}`, true);
      return;
    }

    const headers = { ...(headersParsed.value || {}) };
    if (el.useToken.checked) {
      const token = getToken();
      if (token) headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    }

    const url = joinUrl(baseUrl, path);
    const hasBody = !['GET', 'HEAD'].includes(method);
    const fetchInit = {
      method,
      headers,
    };
    if (hasBody && bodyParsed.value != null) fetchInit.body = JSON.stringify(bodyParsed.value);

    setBadge('Enviando...', 'ok');
    setResponse('—', 'Aguardando resposta...', false);

    const t0 = performance.now();
    try {
      const resp = await fetch(url, fetchInit);
      const ms = Math.round(performance.now() - t0);
      const contentType = resp.headers.get('content-type') || '';
      const text = await resp.text();

      let out = text;
      if (contentType.includes('application/json')) {
        const parsed = safeJsonParse(text);
        if (parsed.ok && parsed.value != null) out = prettyJson(parsed.value);
      }

      const meta = `HTTP ${resp.status} • ${ms}ms • ${contentType || 'sem content-type'}`;
      setBadge(resp.ok ? 'OK' : 'Erro', resp.ok ? 'ok' : 'bad');
      setResponse(meta, out, !resp.ok);

      storage.set(LS.lastReq, { method, path, body: el.body.value || '' });
      addToHistory({
        when: new Date().toLocaleString(),
        method,
        path,
        status: resp.status,
        ms,
        headers: el.headers.value,
        body: el.body.value || '',
        responseText: out,
      });
    } catch (err) {
      const ms = Math.round(performance.now() - t0);
      setBadge('Falha de rede', 'bad');
      setResponse(`Network error • ${ms}ms`, String(err), true);
    }
  }

  async function doLogin() {
    const baseUrl = normalizeBaseUrl(el.baseUrl.value);
    const email = (el.loginEmail.value || '').trim();
    if (!baseUrl) return setBadge('Base URL vazia', 'bad');
    if (!email) return setBadge('Email obrigatório', 'bad');

    setBadge('Logando...', 'ok');
    try {
      const resp = await fetch(joinUrl(baseUrl, 'auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const dataText = await resp.text();
      const parsed = safeJsonParse(dataText);
      const data = parsed.ok ? parsed.value : null;
      if (!resp.ok) {
        setBadge('Login falhou', 'bad');
        setResponse(`HTTP ${resp.status}`, parsed.ok ? prettyJson(data) : dataText, true);
        return;
      }
      const token = data?.token;
      if (!token) {
        setBadge('Sem token', 'bad');
        setResponse('Erro', 'Resposta de login não contém { token }', true);
        return;
      }
      setToken(token);
      el.useToken.checked = true;
      storage.set(LS.useToken, true);
      setBadge('Token OK', 'ok');
      setResponse('Login OK', prettyJson({ token: '(salvo no campo Token)' }), false);
    } catch (err) {
      setBadge('Erro', 'bad');
      setResponse('Erro', String(err), true);
    }
  }

  function copy(text) {
    const t = (text || '').trim();
    if (!t) return;
    navigator.clipboard?.writeText?.(t).catch(() => {});
  }

  function wireEvents() {
    el.saveBaseUrl.addEventListener('click', () => {
      el.baseUrl.value = normalizeBaseUrl(el.baseUrl.value);
      storage.set(LS.baseUrl, el.baseUrl.value);
      setBadge('Base URL salva', 'ok');
    });

    el.jwtToken.addEventListener('input', () => storage.set(LS.token, el.jwtToken.value));
    el.useToken.addEventListener('change', () => storage.set(LS.useToken, el.useToken.checked));
    el.headers.addEventListener('input', () => storage.set(LS.headers, el.headers.value));

    el.btnLogin.addEventListener('click', doLogin);
    el.loginEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doLogin();
    });

    el.copyToken.addEventListener('click', () => copy(el.jwtToken.value));
    el.clearToken.addEventListener('click', () => setToken(''));

    el.applyPreset.addEventListener('click', () => applyPreset(false));
    el.applyPresetAndSend.addEventListener('click', () => applyPreset(true));

    el.beautifyJson.addEventListener('click', () => {
      const p = safeJsonParse(el.body.value);
      if (!p.ok) {
        setBadge('Body JSON inválido', 'bad');
        return;
      }
      if (p.value == null) {
        el.body.value = '';
        return;
      }
      el.body.value = prettyJson(p.value);
      setBadge('Body formatado', 'ok');
    });

    el.clearBody.addEventListener('click', () => (el.body.value = ''));
    el.sendReq.addEventListener('click', sendRequest);
    el.path.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendRequest();
    });

    el.copyResponse.addEventListener('click', () => copy(el.responseBox.textContent));
    el.clearResponse.addEventListener('click', () => setResponse('—', 'Envie uma requisição para ver a resposta aqui.', false));

    el.clearHistory.addEventListener('click', () => {
      storage.remove(LS.history);
      renderHistory();
      setBadge('Histórico limpo', 'ok');
    });
  }

  function boot() {
    initPresets();
    loadFromStorage();
    wireEvents();
    setBadge('Pronto', 'ok');
  }

  boot();
})();


