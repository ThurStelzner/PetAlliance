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

  const MEMBER_PETS = [
    { id: 'm1', ownerName: 'Ana Silva', photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=600&h=600&fit=crop&auto=format', name: 'Rex', breed: 'Golden Retriever', type: 'Cachorro', birthDate: '2020-05-15', weight: '30 kg', vaccinated: true },
    { id: 'm2', ownerName: 'Carlos Souza', photo: 'https://images.unsplash.com/photo-1513245543132-31f507757fb2?w=600&h=600&fit=crop&auto=format', name: 'Luna', breed: 'Siamês', type: 'Gato', birthDate: '2021-08-22', weight: '4 kg', vaccinated: true },
    { id: 'm3', ownerName: 'Mariana Costa', photo: 'https://images.unsplash.com/photo-1583511655857-d19bc10f7595?w=600&h=600&fit=crop&auto=format', name: 'Max', breed: 'Bulldog Francês', type: 'Cachorro', birthDate: '2019-11-02', weight: '12 kg', vaccinated: true },
    { id: 'm4', ownerName: 'João Pereira', photo: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop&auto=format', name: 'Mia', breed: 'Persa', type: 'Gato', birthDate: '2022-01-10', weight: '3 kg', vaccinated: true },
  ];

  // --- Helpers ---
  // Máscaras de entrada
  function maskCPF(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length <= 3) {
      input.value = value;
    } else if (value.length <= 6) {
      input.value = value.slice(0, 3) + '.' + value.slice(3);
    } else if (value.length <= 9) {
      input.value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6);
    } else {
      input.value = value.slice(0, 3) + '.' + value.slice(3, 6) + '.' + value.slice(6, 9) + '-' + value.slice(9);
    }
  }

  function maskPhone(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length <= 2) {
      input.value = value;
    } else if (value.length <= 7) {
      input.value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
    } else {
      input.value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
    }
  }

  function maskCEP(event) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length <= 5) {
      input.value = value;
    } else {
      input.value = value.slice(0, 5) + '-' + value.slice(5);
    }
  }

  // Validações
  function validateEmail(email) {
    return email.includes('@') && email.includes('.');
  }

  function validateCPF(cpf) {
    const value = cpf.replace(/\D/g, '');
    return value.length === 11;
  }

  function validatePhone(phone) {
    const value = phone.replace(/\D/g, '');
    return value.length === 11;
  }

  function validateCEP(cep) {
    const value = cep.replace(/\D/g, '');
    return value.length === 8;
  }

  function validateOnlyNumbers(value) {
    return /^\d*$/.test(value.replace(/\D/g, ''));
  }

  function showErrorAlert(message) {
    alert('❌ Erro no cadastro:\n\n' + message);
  }

  // --- Termos de Uso ---
  let termsScrolled = false;
  let termsContent = '';

  function loadTerms() {
    fetch('./TERMOS_DE_USO.txt')
      .then(response => response.text())
      .then(text => {
        termsContent = text;
      })
      .catch(() => {
        termsContent = 'Erro ao carregar os termos de uso. Por favor, tente novamente mais tarde.';
      });
  }

  function openTermsModal() {
    const modal = qs('#terms-modal');
    const contentEl = qs('#terms-content-text');
    contentEl.textContent = termsContent;
    modal.classList.remove('hidden');
    termsScrolled = false;
    qs('#terms-accept-btn').disabled = true;
    qs('#terms-scroll-hint').classList.remove('hidden');
  }

  function openPrivacyModal() {
    alert('🔒 Política de Privacidade\n\nSeus dados pessoais são protegidos conforme a LGPD. Utilizamos suas informações para:\n\n• Criar e manter sua conta\n• Conectar você com outros proprietários de animais\n• Melhorar nossos serviços\n• Enviar comunicações importantes\n\nNunca compartilhamos dados pessoais com terceiros sem seu consentimento.\n\nPara mais detalhes, entre em contato conosco.');
  }

  function closeTermsModal() {
    const modal = qs('#terms-modal');
    modal.classList.add('hidden');
    termsScrolled = false;
  }

  function handleTermsModalScroll(event) {
    const contentDiv = event.target;
    const isAtBottom = contentDiv.scrollHeight - contentDiv.scrollTop - contentDiv.clientHeight < 10;
    
    if (isAtBottom && !termsScrolled) {
      termsScrolled = true;
      qs('#terms-accept-btn').disabled = false;
      qs('#terms-scroll-hint').classList.add('hidden');
    }
  }

  function acceptTerms() {
    qs('#terms-modal').classList.add('hidden');
    qs('#reg-terms-check').disabled = false;
    qs('#reg-terms-check').checked = true;
    qs('#reg-terms-label').classList.remove('terms-label-pending');
    qs('#reg-terms-label').classList.add('terms-label-accepted');
    qs('#reg-terms-hint').textContent = '✅ Termos de Uso aceitos';
    qs('#reg-terms-hint').classList.remove('terms-hint-pending');
    qs('#reg-terms-hint').classList.add('terms-hint-accepted');
  }

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
    pets: [...PETS], // Inicializa com os pets do mock
    selectedPlan: null,
  };

  // --- Navigation ---
  function navigateTo(page) {
    state.page = page;
    qsa('.page').forEach(el => el.classList.add('hidden'));
    const target = qs(`#page-${page}`);
    if (target) target.classList.remove('hidden');

    closeMenu();

    updateNavActive();
    if (page === 'home') renderHomeGrid();
    if (page === 'favorites') renderFavoritesGrid();
    if (page === 'members') renderMembersGrid();
    if (page === 'my-animals') renderMyAnimals();
    if (page === 'matches') renderMatches();
    if (page === 'profile') updateProfileUI();
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
        <div class="flex items-start justify-between gap-3 pet-card-content">
          <div class="min-w-0">
            <p class="font-semibold text-foreground truncate">${pet.name} <span class="text-sm text-muted-foreground">• ${pet.breed}</span></p>
            <p class="text-xs text-muted-foreground mt-1">${calcAge(pet.birthDate)} • ${pet.weight}</p>
          </div>
          <div class="pet-card-actions">
            <button class="view-btn btn-primary pet-card-view-btn" data-id="${pet.id}">Ver</button>
            <button class="fav-btn pet-card-fav-btn" aria-label="favorite" data-id="${pet.id}">♥</button>
          </div>
        </div>
      </div>
    `;
    // favorite state
    const favBtn = qs('.fav-btn', div);
    const petId = Number(pet.id);
    if (state.favorites.map(Number).includes(petId)) favBtn.classList.add('is-favorite');
    
    favBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggleFavorite(petId);
      favBtn.classList.toggle('is-favorite');
    });
    qs('.view-btn', div).addEventListener('click', () => openPetModal(pet));
    return div;
  }

  function renderMembersGrid() {
    const container = qs('#members-grid');
    if (!container) return;
    container.innerHTML = '';
    MEMBER_PETS.forEach(p => container.appendChild(createCard(p)));
  }

  function renderHomeGrid() {
    const container = qs('#home-grid');
    container.innerHTML = '';
    state.pets.forEach(p => container.appendChild(createCard(p)));
    qs('#home-loader').classList.add('hidden');
  }

  function renderFavoritesGrid() {
    const grid = qs('#favorites-grid');
    const emptyBox = qs('#favorites-empty');
    grid.innerHTML = '';
    const favs = state.pets.filter(p => state.favorites.includes(p.id));
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
      const isSelected = state.selectedPlan && state.selectedPlan.id === plan.id;
      div.className = `plan-card cursor-pointer hover:border-primary transition-all p-4 border rounded-2xl bg-card shadow-sm ${isSelected ? 'border-primary ring-2 ring-primary' : ''}`;
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
    state.selectedPlan = plan;
    renderPlans();

    const banner = qs('#selected-plan-banner');
    const nameEl = qs('#selected-plan-name');
    const descEl = qs('#selected-plan-desc');

    if (banner) {
      banner.classList.remove('hidden');
      nameEl.textContent = plan.name;
      descEl.textContent = plan.desc;
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
    const favCount = qs('#fav-count');
    const favCountMobile = qs('#fav-count-mobile');

    if (favCount) favCount.textContent = count || '';
    if (favCountMobile) favCountMobile.textContent = count || '';

    if (count) {
      if (favCount) favCount.classList.remove('hidden');
      if (favCountMobile) favCountMobile.classList.remove('hidden');
    } else {
      if (favCount) favCount.classList.add('hidden');
      if (favCountMobile) favCountMobile.classList.add('hidden');
    }
  }

  // --- Modal / Pet detail ---
  function openPetModal(pet) {
    const modal = qs('#modal-container');
    const content = qs('#modal-content');
    modal.classList.remove('hidden');
    modal.classList.add('open');
    content.innerHTML = `
      <div class="pet-modal">
        <div class="pet-modal-header">
          <div class="pet-modal-media">
            <img src="${pet.photo}" alt="${pet.name}" class="w-full h-full object-cover">
          </div>
          <div class="pet-modal-info">
            <h3 class="pet-modal-title">${pet.name}</h3>
            <p class="pet-modal-subtitle">${pet.breed} • ${calcAge(pet.birthDate)}</p>
            <p class="pet-modal-subtitle">Proprietário: ${pet.ownerName}</p>
            <div class="pet-modal-actions">
              <button id="modal-fav" class="pet-modal-fav">Favoritar</button>
              <button id="modal-chat" class="pet-modal-chat">Chat</button>
            </div>
          </div>
        </div>
        <button onclick="closeModal()" class="pet-modal-close">Fechar</button>
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
    
    const name = qs('#reg-name').value.trim();
    const email = qs('#reg-email').value.trim();
    const cpf = qs('#reg-cpf').value.trim();
    const phone = qs('#reg-phone').value.trim();
    const cep = qs('#reg-cep').value.trim();
    const password = qs('#reg-password').value.trim();
    const termsCheck = qs('#reg-terms-check').checked;

    // Validações
    if (!name || !email || !cpf || !phone || !cep || !password) { 
      showErrorAlert('Por favor, preencha todos os campos obrigatórios.');
      return; 
    }

    if (name.length < 3) {
      showErrorAlert('O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    if (!validateEmail(email)) {
      showErrorAlert('Email inválido.\n\nO email deve conter @ e . (exemplo: seu@email.com)');
      return;
    }

    if (!validateCPF(cpf)) {
      showErrorAlert('CPF inválido.\n\nDigite um CPF válido no formato: 000.000.000-00');
      return;
    }

    if (!validatePhone(phone)) {
      showErrorAlert('Telefone inválido.\n\nDigite um telefone válido no formato: (00) 00000-0000');
      return;
    }

    if (!validateCEP(cep)) {
      showErrorAlert('CEP inválido.\n\nDigite um CEP válido no formato: 00000-000');
      return;
    }

    if (password.length < 6) {
      showErrorAlert('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (!termsCheck) {
      showErrorAlert('Você deve aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }

    // Se passou em todas as validações, registrar
    state.user = { nome: name, email, cpf, phone, cep };
    localStorage.setItem('pa:user', JSON.stringify(state.user));
    qs('#reg-error').classList.add('hidden');
    updateAuthUI();
    alert('✅ Cadastro realizado com sucesso!');
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
      
      // Atualiza avatar na NavBar
      const navAvatar = qs('#nav-profile-avatar');
      if (navAvatar) {
        const imgUrl = state.user.avatar || 'assets/img/default-avatar.png';
        navAvatar.innerHTML = `<img src="${imgUrl}" alt="Profile">`;
      }
    } else {
      qs('#auth-btn').classList.remove('hidden'); qs('#auth-btn-mobile')?.classList?.remove('hidden');
      qs('#logout-btn').classList.add('hidden'); qs('#logout-btn-mobile')?.classList.add('hidden');
    }
  }

  // --- Theme Manager ---
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      qs('#theme-toggle-dot')?.style.setProperty('left', '27px');
      qs('#theme-toggle')?.style.setProperty('background', 'var(--color-primary)');
    } else {
      document.body.classList.remove('dark-theme');
      qs('#theme-toggle-dot')?.style.setProperty('left', '3px');
      qs('#theme-toggle')?.style.setProperty('background', 'var(--color-border)');
    }
    localStorage.setItem('pa:theme', theme);
  }

  function toggleTheme() {
    const currentTheme = localStorage.getItem('pa:theme') === 'dark' ? 'light' : 'dark';
    applyTheme(currentTheme);
  }

  function updateProfileUI() {
    if (!state.user) return;
    qs('#profile-name').textContent = state.user.nome || 'Usuário';
    qs('#profile-email').textContent = state.user.email || 'email@exemplo.com';
    qs('#profile-cpf').textContent = state.user.cpf || '-';
    qs('#profile-cep').textContent = state.user.cep || '-';
    qs('#profile-phone').textContent = state.user.phone || '-';
    
    const avatarContainer = qs('#profile-avatar-container');
    if (avatarContainer && state.user.avatar) {
      avatarContainer.innerHTML = `<img src="${state.user.avatar}" class="avatar-img">`;
    }
  }
  function handleRegAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = qs('#reg-avatar-preview img') || document.createElement('img');
      if (!qs('#reg-avatar-preview img')) {
        qs('#reg-avatar-preview').innerHTML = '';
        qs('#reg-avatar-preview').appendChild(img);
      }
      img.src = e.target.result;
      img.classList.add('avatar-img');
      qs('#reg-display-name').textContent = qs('#reg-name').value || 'Seu nome aqui';
      qs('#reg-display-email').textContent = qs('#reg-email').value || 'seu@email.com';
    };
    reader.readAsDataURL(file);
  }

  function handleProfileAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const container = qs('#profile-avatar-container');
      container.innerHTML = '<img src="' + e.target.result + '" class="avatar-img">';
      
      // Atualiza avatar na NavBar
      const navAvatar = qs('#nav-profile-avatar');
      if (navAvatar) {
        navAvatar.innerHTML = '<img src="' + e.target.result + '" class="avatar-img">';
      }
      
      // Atualiza estado e localStorage
      if (state.user) {
        state.user.avatar = e.target.result;
        localStorage.setItem('pa:user', JSON.stringify(state.user));
      }
    };
    reader.readAsDataURL(file);
  }

  function handleTermsScroll(event) {
    const box = event.target;
    const label = qs('#reg-terms-label');
    const hint = qs('#reg-terms-hint');
    const checkbox = qs('#reg-terms-check');
    const isAtBottom = box.scrollHeight - box.scrollTop - box.clientHeight < 10;
    
    if (isAtBottom) {
      hint.classList.add('hidden');
      label.style.opacity = '1';
      label.style.pointerEvents = 'auto';
      checkbox.disabled = false;
    }
  }

  function renderMyAnimals() {
    const grid = qs('#my-animals-grid');
    const empty = qs('#my-animals-empty');
    if (!grid || !empty) return;

    grid.innerHTML = '';
    const myPets = state.pets.filter(pet => pet.userId === state.user?.id);

    if (myPets.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    myPets.forEach(pet => {
      grid.appendChild(createCard(pet));
    });
  }

  function renderMatches() {
    const grid = qs('#matches-grid');
    const empty = qs('#matches-empty');
    if (!grid || !empty) return;

    grid.innerHTML = '';
    const matches = state.pets.filter(pet => pet.userId !== state.user?.id && Math.random() > 0.7);

    if (matches.length === 0) {
      empty.classList.remove('hidden');
      return;
    }
    empty.classList.add('hidden');
    matches.forEach(pet => {
      grid.appendChild(createCard(pet));
    });
  }

  function openRegisterAnimalModal() {
    const container = qs('#modal-container');
    const content = qs('#modal-content');
    if (!container || !content) return;

    content.innerHTML = `
      <div class="modal-body">
        <div class="modal-header">
          <h2 class="modal-title">Cadastrar Animal</h2>
          <button onclick="closeModal()" class="modal-close-btn">×</button>
        </div>
        <form onsubmit="handleAnimalRegister(event)" class="auth-card-form">
          <div class="form-group">
            <label class="form-label">Nome do Pet</label>
            <input name="petName" type="text" required class="form-input" placeholder="Ex: Max">
          </div>
          <div class="form-group">
            <label class="form-label">Espécie</label>
            <input name="species" type="text" required class="form-input" placeholder="Ex: Cachorro">
          </div>
          <div class="form-group">
            <label class="form-label">Idade</label>
            <input name="age" type="number" required class="form-input" placeholder="Ex: 2">
          </div>
          <div class="form-group">
            <label class="form-label">Foto</label>
            <input name="photo" type="file" accept="image/*" class="form-input">
          </div>
          <div class="modal-footer">
            <button type="button" onclick="closeModal()" class="btn-secondary flex-1">Cancelar</button>
            <button type="submit" class="btn-primary flex-1">Cadastrar</button>
          </div>
        </form>
      </div>
    `;
    container.classList.remove('hidden');
  }

  function handleAnimalRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newPet = {
      id: Date.now(),
      name: formData.get('petName'),
      species: formData.get('species'),
      age: formData.get('age'),
      photo: 'assets/img/default-pet.png',
      userId: state.user?.id,
      favorites: 0
    };
    state.pets.push(newPet);
    closeModal();
    renderMyAnimals();
    renderHomeGrid();
    alert('Animal cadastrado com sucesso!');
  }

  // --- Mobile menu ---
  function toggleMenu() { 
    const m = qs('#mobile-menu'); 
    const container = qs('.mobile-menu-container');
    const isOpen = m.classList.toggle('hidden');
    
    if (container) {
      container.classList.toggle('active', !isOpen);
    }
  }

  function closeMenu() {
    const m = qs('#mobile-menu'); 
    const container = qs('.mobile-menu-container');
    if (m) m.classList.add('hidden');
    if (container) container.classList.remove('active');
  }

  // Adiciona listener para fechar ao clicar fora
  function setupMobileMenuListeners() {
    const container = qs('.mobile-menu-container');
    if (!container) return;
    container.addEventListener('click', (e) => {
      if (e.target === container) {
        closeMenu();
      }
    });
  }

  // --- Init ---
  function init() {
    // wire buttons
    qsa('[onclick^="navigateTo("]') .forEach?.(() => {}); // noop to avoid lint
    window.navigateTo = navigateTo; // allow inline handlers in HTML to call navigateTo
    window.openMatches = () => navigateTo('matches');
    window.openCheckout = openCheckout;
    window.toggleMenu = toggleMenu;
    window.logout = logout;
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.closeModal = closeModal;
    
    setupMobileMenuListeners();
    
    // Theme init
    applyTheme(localStorage.getItem('pa:theme') || 'light');
    qs('#theme-toggle')?.addEventListener('click', toggleTheme);
    
    // Expor funções de máscaras e validações
    window.maskCPF = maskCPF;
    window.maskPhone = maskPhone;
    window.maskCEP = maskCEP;
    window.validateEmail = validateEmail;
    window.validateCPF = validateCPF;
    window.validatePhone = validatePhone;
    window.validateCEP = validateCEP;
    window.showErrorAlert = showErrorAlert;
    window.handleRegAvatar = handleRegAvatar;
    window.handleProfileAvatar = handleProfileAvatar;
    window.handleTermsScroll = handleTermsScroll;
    // Funções de termos de uso
    window.openTermsModal = openTermsModal;
    window.openPrivacyModal = openPrivacyModal;
    window.closeTermsModal = closeTermsModal;
    window.acceptTerms = acceptTerms;
    window.handleTermsModalScroll = handleTermsModalScroll;
    // attach file handlers where used
    qs('#auth-btn')?.addEventListener('click', () => navigateTo('login'));
    qs('#auth-btn-mobile')?.addEventListener('click', () => navigateTo('login'));
    qs('#logout-btn')?.addEventListener('click', logout);

    // Adicionar listener para scroll do modal de termos
    const termsContentDiv = qs('#terms-content-text')?.parentElement;
    if (termsContentDiv) {
      termsContentDiv.addEventListener('scroll', handleTermsModalScroll);
    }

    // Carregar termos
    loadTerms();

    // navigation via data attributes
    qsa('.nav-link').forEach(b => b.addEventListener('click', () => navigateTo(b.dataset.page)));
    qsa('.mobile-nav-link').forEach(b => b.addEventListener('click', () => { navigateTo(b.dataset.page); closeMenu(); }));

    renderHomeGrid();
    renderFavoritesGrid();
    updateFavBadges();
    updateAuthUI();
    // start on home
    navigateTo(state.page || 'home');
  }

  document.addEventListener('DOMContentLoaded', init);
})();
