/* global window, document, navigator, bootstrap */
(() => {
  const qs = (sel) => document.querySelector(sel);

  const LS = {
    token: 'ui.jwtToken',
  };

  const storage = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v == null ? fallback : v;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
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

  function getToken() {
    return (storage.get(LS.token, '') || '').trim();
  }

  function setToken(token) {
    storage.set(LS.token, (token || '').trim());
    refreshTokenBadge();
  }

  function refreshTokenBadge() {
    const badge = qs('#tokenBadge');
    if (!badge) return;
    const t = getToken();
    badge.textContent = t ? 'OK' : 'vazio';
    badge.style.borderColor = t ? 'rgba(110,255,190,.25)' : 'rgba(255,255,255,.14)';
    badge.style.background = t ? 'rgba(110,255,190,.10)' : 'rgba(255,255,255,.10)';
  }

  function copy(text) {
    const t = (text || '').trim();
    if (!t) return;
    navigator.clipboard?.writeText?.(t).catch(() => {});
  }

  function buildApiPath(template, values) {
    let out = template;
    for (const [k, v] of Object.entries(values)) {
      out = out.replaceAll(`:${k}`, encodeURIComponent(String(v)));
    }
    return out;
  }

  function formToObject(form) {
    const data = new FormData(form);
    const obj = {};
    for (const [k, v] of data.entries()) {
      const s = String(v ?? '').trim();
      if (s === '') continue;
      obj[k] = s;
    }
    return obj;
  }

  function coerceBody(obj) {
    // tenta converter números e datas; mantém string se não for claro
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      if (/^\d+$/.test(v)) {
        out[k] = Number(v);
        continue;
      }
      // datetime-local => "YYYY-MM-DDTHH:mm"
      if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v)) {
        out[k] = new Date(v).toISOString();
        continue;
      }
      out[k] = v;
    }
    return out;
  }

  function pretty(value) {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  async function showTokenModal() {
    const modalEl = qs('#tokenModal');
    if (!modalEl) return;
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    const tokenValue = qs('#tokenValue');
    if (tokenValue) tokenValue.value = getToken();
    modal.show();
  }

  function wireTokenModal() {
    const btnShow = qs('#btnShowToken');
    if (btnShow) btnShow.addEventListener('click', showTokenModal);

    const tokenValue = qs('#tokenValue');
    if (tokenValue) tokenValue.addEventListener('input', () => setToken(tokenValue.value));

    const copyBtn = qs('#copyToken');
    if (copyBtn) copyBtn.addEventListener('click', () => copy(getToken()));

    const clearBtn = qs('#clearToken');
    if (clearBtn)
      clearBtn.addEventListener('click', () => {
        storage.remove(LS.token);
        const tokenValue2 = qs('#tokenValue');
        if (tokenValue2) tokenValue2.value = '';
        refreshTokenBadge();
      });
  }

  async function runEndpointForm(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const btnRun = qs('#btnRun');
    const reqMeta = qs('#reqMeta');

    const apiMethod = (form.dataset.apiMethod || 'GET').toUpperCase();
    const apiPathTemplate = form.dataset.apiPath || '/';
    const requiresAuth = form.dataset.requiresAuth === '1';
    const storeTokenFrom = (form.dataset.storeTokenFrom || '').trim();

    const raw = formToObject(form);
    const pathValues = {};
    const bodyValues = {};
    for (const [k, v] of Object.entries(raw)) {
      // heurística: campos de path são aqueles usados como :param no template
      if (apiPathTemplate.includes(`:${k}`)) pathValues[k] = v;
      else bodyValues[k] = v;
    }

    const apiPath = buildApiPath(apiPathTemplate, pathValues);
    const hasBody = !['GET', 'HEAD', 'DELETE'].includes(apiMethod) && Object.keys(bodyValues).length > 0;

    const headers = { 'Content-Type': 'application/json' };
    if (requiresAuth) {
      const t = getToken();
      if (t) headers.Authorization = t.startsWith('Bearer ') ? t : `Bearer ${t}`;
    }

    if (reqMeta) reqMeta.textContent = `${apiMethod} ${apiPath}`;
    if (btnRun) {
      btnRun.disabled = true;
      btnRun.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Executando...';
    }

    const t0 = performance.now();
    try {
      const resp = await fetch(apiPath, {
        method: apiMethod,
        headers,
        body: hasBody ? JSON.stringify(coerceBody(bodyValues)) : undefined,
      });
      const ms = Math.round(performance.now() - t0);
      const contentType = resp.headers.get('content-type') || '';
      const text = await resp.text();
      let payload = text;
      if (contentType.includes('application/json')) {
        try {
          payload = pretty(JSON.parse(text));
        } catch {
          payload = text;
        }
      }

      // se a rota for login, salva token automaticamente
      if (storeTokenFrom && contentType.includes('application/json')) {
        try {
          const parsed = JSON.parse(text);
          if (parsed && parsed[storeTokenFrom]) setToken(String(parsed[storeTokenFrom]));
        } catch {
          // ignore
        }
      }

      const modalEl = qs('#resultModal');
      const modal = modalEl ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;
      const title = qs('#resultTitle');
      const meta = qs('#resultMeta');
      const body = qs('#resultBody');

      if (title) title.textContent = `Resposta • ${apiMethod} ${apiPath}`;
      if (meta) meta.textContent = `HTTP ${resp.status} • ${ms}ms • ${contentType || 'sem content-type'}`;
      if (body) body.textContent = payload || '—';

      const copyBtn = qs('#copyResult');
      if (copyBtn) copyBtn.onclick = () => copy(body?.textContent || '');

      if (modal) modal.show();
    } catch (err) {
      const modalEl = qs('#resultModal');
      const modal = modalEl ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;
      const title = qs('#resultTitle');
      const meta = qs('#resultMeta');
      const body = qs('#resultBody');
      if (title) title.textContent = 'Erro de rede';
      if (meta) meta.textContent = 'Falha ao chamar a API';
      if (body) body.textContent = String(err);
      if (modal) modal.show();
    } finally {
      if (btnRun) {
        btnRun.disabled = false;
        btnRun.innerHTML = '<i class="bi bi-play-fill"></i> Executar';
      }
    }
  }

  function boot() {
    refreshTokenBadge();
    wireTokenModal();

    if (window.__UI__?.page === 'endpoint') {
      const form = qs('#endpointForm');
      if (form) form.addEventListener('submit', runEndpointForm);
    }
  }

  boot();
})();


