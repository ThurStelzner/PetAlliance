// PetAlliance - static JS version (vanilla)
// Minimal, faithful port of the app's behavior for static HTML/CSS/JS

(function () {
  // --- Mock data (trimmed from original React source) ---
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
    div.className = 'bg-card rounded-2xl overflow-hidden shadow-sm border border-border';
    div.innerHTML = `
      <div class="w-full h-44 overflow-hidden bg-muted">
        <img src="${pet.photo}" alt="${pet.name}" class="w-full h-full object-cover">
      </div>
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="font-semibold text-foreground truncate">${pet.name} <span class="text-sm text-muted-foreground">• ${pet.breed}</span></p>
            <p class="text-xs text-muted-foreground mt-1">${calcAge(pet.birthDate)} • ${pet.weight}</p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <button class="fav-btn p-2 rounded-lg text-red-500" aria-label="favorite" data-id="${pet.id}">♥</button>
            <button class="view-btn bg-primary text-white px-3 py-1 rounded-lg text-sm" data-id="${pet.id}">Ver</button>
          </div>
        </div>
      </div>
    `;
    // favorite state
    const favBtn = qs('.fav-btn', div);
    if (state.favorites.includes(pet.id)) favBtn.classList.add('text-white', 'bg-red-500');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(pet.id);
      favBtn.classList.toggle('text-white');
      favBtn.classList.toggle('bg-red-500');
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
    content.innerHTML = `
      <div class="p-6">
        <div class="flex items-start gap-4">
          <div class="w-36 h-36 rounded-xl overflow-hidden bg-muted flex-shrink-0">
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

  function closeModal() { qs('#modal-container').classList.add('hidden'); qs('#modal-content').innerHTML = ''; }

  // --- Chat simple ---
  function openChat(pet) {
    openPetModal(pet); // reuse modal then replace content
    const content = qs('#modal-content');
    content.innerHTML = `
      <div class="p-4 flex flex-col h-[60vh]">
        <div class="flex items-center gap-3 mb-3">
          <div class="w-10 h-10 rounded-full overflow-hidden"><img src="${pet.photo}" class="w-full h-full object-cover"></div>
          <div>
            <div class="font-semibold">${pet.ownerName}</div>
            <div class="text-xs text-muted-foreground">sobre ${pet.name}</div>
          </div>
        </div>
        <div id="chat-log" class="flex-1 overflow-y-auto bg-secondary rounded-xl p-3 mb-3"></div>
        <div class="flex gap-2">
          <input id="chat-input" class="flex-1 bg-input-background rounded-xl px-3 py-2 border border-border" placeholder="Escreva uma mensagem...">
          <button id="chat-send" class="bg-primary text-white px-4 py-2 rounded-xl">Enviar</button>
        </div>
      </div>
    `;
    const log = qs('#chat-log');
    function add(msg, who) {
      const el = document.createElement('div');
      el.className = `mb-2 ${who==='me'?'text-right':''}`;
      el.innerHTML = `<div class="inline-block rounded-2xl px-3 py-2 ${who==='me'?'bg-primary text-white':'bg-card text-foreground border border-border'}">${msg}</div>`;
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
  function toggleMenu() { const m = qs('#mobile-menu'); m.classList.toggle('hidden'); }

  // --- Init ---
  function init() {
    // wire buttons
    qsa('[onclick^="navigateTo("]') .forEach?.(() => {}); // noop to avoid lint
    window.navigateTo = navigateTo; // allow inline handlers in HTML to call navigateTo
    window.openMatches = () => alert('Matches (simplified)');
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
