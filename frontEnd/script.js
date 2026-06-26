// PetAlliance - static JS version (vanilla)
// Minimal, faithful port of the app's behavior for static HTML/CSS/JS

(function () {
  // --- Mock data (trimmed from original React source) ---
  const PLANS = [
    { id: 'basic', name: 'Iniciante', price: 'R$ <spam class="dindin"> 7,50 </spam>/mês', features: ['5 Animais por mês', 'Perfil Verificado', 'Medalha de membro'] },
    { id: 'standard', name: 'Standard', price: 'R$ 15,00/mês', features: ['10 animais por mês', 'Perfil Verificado', 'Medalha de membro'] },
    { id: 'premium', name: 'Premium', price: 'R$ 30,00/mês', features: ['20 animais por mês', 'Perfil Verificado', 'Medalha de membro'] },
    { id: 'vip', name: 'VIP', price: 'R$ 45,00/mês', features: ['30 animais por mês', 'Perfil Verificado', 'Medalha de membro'] },
  ];

  const PETS = [
    { id: 1, ownerName: "Mariana Costa", photo: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop&auto=format", name: "Thor", breed: "Golden Retriever", type: "Cachorro", birthDate: "2021-03-14", weight: "34 kg", vaccinated: true },
    { id: 2, ownerName: "Lucas Ferreira", photo: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=600&h=600&fit=crop&auto=format", name: "Mel", breed: "Bulldog Francês", type: "Cachorro", birthDate: "2022-07-20", weight: "10 kg", vaccinated: true },
    { id: 3, ownerName: "Beatriz Santos", photo: "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&h=600&fit=crop&auto=format", name: "Simba", breed: "Maine Coon", type: "Gato", birthDate: "2020-11-05", weight: "8 kg", vaccinated: true },
    { id: 4, ownerName: "Rafael Oliveira", photo: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=600&fit=crop&auto=format", name: "Bolt", breed: "Border Collie", type: "Cachorro", birthDate: "2021-09-12", weight: "22 kg", vaccinated: true },
    { id: 5, ownerName: "Camila Rocha", photo: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=600&h=600&fit=crop&auto=format", name: "Nina", breed: "Poodle", type: "Cachorro", birthDate: "2023-01-28", weight: "4 kg", vaccinated: true },
  ];

  // --- Helpers ---
  function calcAge(bd) {
    const diff = Date.now() - new Date(bd).getTime();
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (years > 0) return `${years} ano${years > 1 ? 's' : ''}`;
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    return `${months} mês${months !== 1 ? 'es' : ''}`;
  }

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  // --- State ---
  let state = {
    page: 'home',
    favorites: JSON.parse(localStorage.getItem('pa:favs') || '[]'),
    user: JSON.parse(localStorage.getItem('pa:user') || 'null'),
  };

  // --- Navigation ---
  function navigateTo(page) {
    state.page = page;
    qsa('.page').forEach(el => el.classList.add('hidden'));
    const target = qs(`#page-${page}`);
    if (target) target.classList.remove('hidden');
    updateNavActive();
    if (page === 'home') renderHomeGrid();
    if (page === 'favorites') renderFavoritesGrid();
    if (page === 'members') renderPlans();
  }

  function updateNavActive() {
    qsa('.nav-link, .mobile-nav-link').forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.page === state.page) btn.classList.add('active');
    });
  }

  // --- Renderers ---
  function createCard(pet) {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <div class="pet-card-media">
        <img src="${pet.photo}" alt="${pet.name}" class="w-full h-full object-cover">
      </div>
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-foreground truncate">${pet.name} <span class="text-sm text-muted-foreground">• ${pet.breed}</span></p>
            <p class="text-xs text-muted-foreground mt-1">${calcAge(pet.birthDate)} • ${pet.weight}</p>
          </div>
          <div class="flex flex-row items-center gap-2">
            <button class="view-btn btn-primary pet-card-view-btn" data-id="${pet.id}">Ver</button>
            <button class="fav-btn pet-card-fav-btn" aria-label="favorite" data-id="${pet.id}">♥</button>
          </div>
        </div>
      </div>
    `;
    // favorite state
    const favBtn = qs('.fav-btn', div);
    if (state.favorites.includes(pet.id)) favBtn.classList.add('is-favorite');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(pet.id);
      favBtn.classList.toggle('is-favorite');
    });
    qs('.view-btn', div).addEventListener('click', () => openPetModal(pet));
    return div;
  }

  function renderHomeGrid() {
    const container = qs('#home-grid');
    container.innerHTML = '';
    PETS.forEach(p => container.appendChild(createCard(p)));
    qs('#home-loader').classList.add('hidden');
  }

  function renderFavoritesGrid() {
    const grid = qs('#favorites-grid');
    const emptyBox = qs('#favorites-empty');
    grid.innerHTML = '';
    const favs = PETS.filter(p => state.favorites.includes(p.id));
    if (favs.length === 0) {
      emptyBox.classList.remove('hidden');
      grid.classList.add('hidden');
      return;
    }
    emptyBox.classList.add('hidden');
    grid.classList.remove('hidden');
    favs.forEach(p => grid.appendChild(createCard(p)));
  }

  function renderPlans() {
    const grid = qs('#plans-grid');
    if (!grid) return;
    grid.innerHTML = '';
    PLANS.forEach(plan => {
      const div = document.createElement('div');
      div.className = 'plan-card cursor-pointer hover:border-primary transition-all p-4 border rounded-2xl bg-card shadow-sm';
      div.innerHTML = `
        <h3 class="font-bold text-foreground">${plan.name}</h3>
        <p class="text-xl font-bold text-primary my-2">${plan.price}</p>
        <p class="text-xs text-muted-foreground mb-4">${plan.desc}</p>
        <ul class="text-xs space-y-1 text-muted-foreground mb-4">
          ${plan.features.map(f => `<li>• ${f}</li>`).join('')}
        </ul>
        <button class="w-full py-2 text-xs font-semibold rounded-lg bg-secondary hover:bg-muted transition-colors">Selecionar</button>
      `;
      div.onclick = () => selectPlan(plan);
      grid.appendChild(div);
    });
  }

  function selectPlan(plan) {
    const banner = qs('#selected-plan-banner');
    const nameEl = qs('#selected-plan-name');
    const descEl = qs('#selected-plan-desc');
    
    if (banner) {
      banner.classList.remove('hidden');
      nameEl.textContent = plan.name;
      descEl.textContent = plan.desc;
      banner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function openCheckout() {
    alert('Redirecionando para o checkout de pagamento...');
  }

  // --- Favorites ---
  function toggleFavorite(id) {
    const idx = state.favorites.indexOf(id);
    if (idx === -1) state.favorites.push(id); else state.favorites.splice(idx, 1);
    localStorage.setItem('pa:favs', JSON.stringify(state.favorites));
    updateFavBadges();
  }

  function updateFavBadges() {
    const count = state.favorites.length;
    qs('#fav-count').textContent = count || '';
    qs('#fav-count-mobile').textContent = count || '';
    if (count) { qs('#fav-count').classList.remove('hidden'); qs('#fav-count-mobile').classList.remove('hidden'); }
    else { qs('#fav-count').classList.add('hidden'); qs('#fav-count-mobile').classList.add('hidden'); }
  }

  // --- Modal / Pet detail ---
  function openPetModal(pet) {
    const modal = qs('#modal-container');
    const content = qs('#modal-content');
    modal.classList.remove('hidden');
    modal.classList.add('open');
    content.innerHTML = `
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div class="pet-card-modal-media">
            <img src="${pet.photo}" alt="${pet.name}" class="w-full h-full object-cover">
          </div>
          <div class="flex-1">
            <h3 class="font-display text-2xl font-bold text-foreground mb-1">${pet.name}</h3>
            <p class="text-sm text-muted-foreground mb-3">${pet.breed} • ${calcAge(pet.birthDate)}</p>
            <p class="text-sm text-muted-foreground mb-4">Proprietário: ${pet.ownerName}</p>
            <div class="flex gap-2">
              <button id="modal-fav" class="bg-white text-primary px-4 py-2 rounded-xl border border-border">Favoritar</button>
              <button id="modal-chat" class="bg-primary text-white px-4 py-2 rounded-xl">Chat</button>
            </div>
          </div>
        </div>
        <div class="mt-6">
          <button onclick="closeModal()" class="w-full text-sm text-muted-foreground">Fechar</button>
        </div>
      </div>
    `;
    qs('#modal-overlay').onclick = closeModal;
    qs('#modal-container').onclick = (e) => { if (e.target === modal) closeModal(); };
    qs('#modal-fav').addEventListener('click', () => { toggleFavorite(pet.id); renderFavoritesGrid(); });
    qs('#modal-chat').addEventListener('click', () => openChat(pet));
  }

  function closeModal() { const modal = qs('#modal-container'); modal.classList.add('hidden'); modal.classList.remove('open'); qs('#modal-content').innerHTML = ''; }

  // --- Chat simple ---
  function openChat(pet) {
    openPetModal(pet); // reuse modal then replace content
    const content = qs('#modal-content');
    content.innerHTML = `
      <div class="modal-chat-shell">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full overflow-hidden"><img src="${pet.photo}" class="w-full h-full object-cover"></div>
          <div>
            <div class="font-semibold">${pet.ownerName}</div>
            <div class="text-xs text-muted-foreground">sobre ${pet.name}</div>
          </div>
        </div>
        <div id="chat-log" class="modal-chat-log"></div>
        <div class="flex gap-2">
          <input id="chat-input" class="flex-1 bg-input-background rounded-xl px-3 py-2 border border-border" placeholder="Escreva uma mensagem...">
          <button id="chat-send" class="bg-primary text-white px-4 py-2 rounded-xl">Enviar</button>
        </div>
      </div>
    `;
    const log = qs('#chat-log');
    function add(msg, who) {
      const el = document.createElement('div');
      el.className = `modal-chat-message ${who==='me'?'me':''}`;
      el.innerHTML = `<div class="modal-chat-bubble ${who==='me'?'me':'them'}">${msg}</div>`;
      log.appendChild(el);
      log.scrollTop = log.scrollHeight;
    }
    add(`Olá! Vi que você tem interesse no(a) ${pet.name}. Como posso ajudar?`, 'them');
    qs('#chat-send').addEventListener('click', () => {
      const v = qs('#chat-input').value.trim(); if (!v) return; add(v, 'me'); qs('#chat-input').value = ''; setTimeout(() => add('Perfeito! Vamos combinar os detalhes.', 'them'), 800);
    });
  }

  // --- Auth (very small simulation) ---
  function handleLogin(e) {
    if (e) e.preventDefault();
    const cpf = qs('#login-cpf').value.trim();
    const pass = qs('#login-password').value.trim();
    if (!cpf || !pass) { qs('#login-error').classList.remove('hidden'); return; }
    state.user = { nome: 'Usuário', email: 'user@exemplo.com', cpf };
    localStorage.setItem('pa:user', JSON.stringify(state.user));
    qs('#login-error').classList.add('hidden');
    updateAuthUI();
    navigateTo('home');
  }

  function handleRegister(e) {
    if (e) e.preventDefault();
    // very small register flow: store basic info
    const name = qs('#reg-name').value.trim();
    const email = qs('#reg-email').value.trim();
    const cpf = qs('#reg-cpf').value.trim();
    if (!name || !email || !cpf) { qs('#reg-error').textContent = 'Preencha os campos obrigatórios.'; qs('#reg-error').classList.remove('hidden'); return; }
    state.user = { nome: name, email, cpf };
    localStorage.setItem('pa:user', JSON.stringify(state.user));
    updateAuthUI();
    navigateTo('home');
  }

  function logout() { state.user = null; localStorage.removeItem('pa:user'); updateAuthUI(); navigateTo('home'); }

  function updateAuthUI() {
    const authOnly = qsa('.auth-only');
    authOnly.forEach(el => { if (state.user) el.classList.remove('hidden'); else el.classList.add('hidden'); });
    if (state.user) {
      qs('#auth-btn').classList.add('hidden'); qs('#auth-btn-mobile')?.classList?.add('hidden');
      qs('#logout-btn').classList.remove('hidden'); qs('#logout-btn-mobile')?.classList?.remove('hidden');
      qs('#profile-name') && (qs('#profile-name').textContent = state.user.nome || 'Usuário');
    } else {
      qs('#auth-btn').classList.remove('hidden'); qs('#auth-btn-mobile')?.classList?.remove('hidden');
      qs('#logout-btn').classList.add('hidden'); qs('#logout-btn-mobile')?.classList.add('hidden');
    }
  }

  // --- Mobile menu ---
  function toggleMenu() { const m = qs('#mobile-menu'); m.classList.toggle('open'); }

  // --- Init ---
  function init() {
    // wire buttons
    qsa('[onclick^="navigateTo("]') .forEach?.(() => {}); // noop to avoid lint
    window.navigateTo = navigateTo; // allow inline handlers in HTML to call navigateTo
    window.openMatches = () => alert('Matches (simplified)');
    window.openCheckout = openCheckout;
    window.toggleMenu = toggleMenu;
    window.logout = logout;
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.closeModal = closeModal;
    // attach file handlers where used
    qs('#auth-btn')?.addEventListener('click', () => navigateTo('login'));
    qs('#auth-btn-mobile')?.addEventListener('click', () => navigateTo('login'));
    qs('#logout-btn')?.addEventListener('click', logout);

    // navigation via data attributes
    qsa('.nav-link').forEach(b => b.addEventListener('click', () => navigateTo(b.dataset.page)));
    qsa('.mobile-nav-link').forEach(b => b.addEventListener('click', () => { navigateTo(b.dataset.page); toggleMenu(); }));

    renderHomeGrid();
    renderFavoritesGrid();
    updateFavBadges();
    updateAuthUI();
    // start on home
    navigateTo(state.page || 'home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
