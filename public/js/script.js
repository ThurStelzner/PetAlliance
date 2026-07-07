// PetAlliance - static JS version (vanilla)
// Minimal, faithful port of the app's behavior for static HTML/CSS/JS

(function () {
  // --- Mock data (trimmed from original React source) ---
  const PLANS = [
    { id: 'iniciante', name: 'Iniciante', price: '7,50', priceFull: 'R$ 7,50/mês', features: ['5 animais por mês', 'Perfil verificado', 'Badge de membro', 'Chat com donos'], isPopular: false },
    { id: 'basico', name: 'Básico', price: '15,00', priceFull: 'R$ 15,00/mês', features: ['10 animais por mês', 'Perfil verificado', 'Badge de membro', 'Chat com donos'], isPopular: false },
    { id: 'profissional', name: 'Profissional', price: '30,00', priceFull: 'R$ 30,00/mês', features: ['20 animais por mês', 'Perfil verificado', 'Badge de membro', 'Chat com donos'], isPopular: true },
    { id: 'premium', name: 'Premium', price: '45,00', priceFull: 'R$ 45,00/mês', features: ['30 animais por mês', 'Perfil verificado', 'Badge de membro', 'Chat com donos'], isPopular: false },
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

  // --- API Helper ---
  async function apiCall(controller, action, params = {}) {
    const query = new URLSearchParams({ controller, action, ...params }).toString();
    const response = await fetch(`./api.php?${query}`);
    const data = await response.json();
    if (data.erro) throw new Error(data.erro);
    return data;
  }

  async function apiPost(controller, action, data = {}) {
    const query = new URLSearchParams({ controller, action }).toString();
    const isFormData = data instanceof FormData;
    const options = {
      method: 'POST',
    };
    if (isFormData) {
      options.body = data;
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(data);
    }
    const response = await fetch(`./api.php?${query}`, options);
    const resData = await response.json();
    if (resData.erro) throw new Error(resData.erro);
    return resData;
  }
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
  
  function normalizeCPF(cpf) {
    return cpf ? cpf.replace(/\D/g, '') : '';
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
    const modal = qs('#privacy-modal');
    modal.classList.remove('hidden');
  }

  function closePrivacyModal() {
    const modal = qs('#privacy-modal');
    modal.classList.add('hidden');
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
    if (!bd) return 'Idade não informada';
    const date = new Date(bd);
    if (isNaN(date.getTime())) return 'Idade inválida';
    
    const diff = Date.now() - date.getTime();
    if (diff < 0) return 'Recém-nascido';
    
    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    if (years > 0) return `${years} ano${years > 1 ? 's' : ''}`;
    
    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30.44));
    return `${months} mês${months !== 1 ? 'es' : ''}`;
  }

  function formatDateBR(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr + 'T00:00:00');
    if (isNaN(date)) return dateStr;
    return date.toLocaleDateString('pt-BR');
  }

  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }

  function scrollToSection(sectionId) {
    const element = qs(`#${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Update active state in sidebar
      qsa('.settings-nav-link').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('onclick').includes(sectionId)) {
          btn.classList.add('active');
        }
      });
    }
  }

  // --- State ---
  let state = {
    page: 'home',
    favorites: JSON.parse(localStorage.getItem('pa:favs') || '[]'),
    user: JSON.parse(localStorage.getItem('pa:user') || 'null'),
    pets: [], 
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
    if (page === 'members') {
      renderMembersGrid();
      renderPlans();
    }
    if (page === 'my-animals') renderMyAnimals();
    if (page === 'matches') renderMatches();
    if (page === 'profile') updateProfileUI();

    // Hide footer on auth pages
    const footer = qs('.main-footer');
    if (footer) {
      footer.classList.toggle('hidden', page === 'login' || page === 'register');
    }
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
        <img src="uploads/animais/${pet.photo}" alt="${pet.name}" class="w-full h-full object-cover">
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

  async function renderMembersGrid() {
    const container = qs('#members-grid');
    if (!container) return;
    container.innerHTML = '';
    try {
      const pets = await apiCall('animal', 'listarMembros', { id: state.user?.cpf || 'guest' });
      pets.forEach(p => container.appendChild(createCard(p)));
    } catch (e) {
      console.error('Erro ao carregar membros:', e);
    }
  }

  async function renderHomeGrid() {
    const container = qs('#home-grid');
    if (!container) return;
    container.innerHTML = '';
    
    try {
      const pets = await apiCall('animal', 'listarAnimais', { id: state.user?.cpf || 'guest' });
      state.pets = pets;
      pets.forEach(p => container.appendChild(createCard(p)));
    } catch (e) {
      console.error('Erro ao carregar pets:', e);
    } finally {
      qs('#home-loader')?.classList.add('hidden');
    }
  }

  async function renderFavoritesGrid() {
    const grid = qs('#favorites-grid');
    const emptyBox = qs('#favorites-empty');
    if (!grid) return;
    grid.innerHTML = '';
    
    try {
      const favs = await apiCall('animal', 'listarAnimaisFavoritos', { id: state.user?.cpf || '' });
      if (favs.length === 0) {
        emptyBox.classList.remove('hidden');
        grid.classList.add('hidden');
        return;
      }
      emptyBox.classList.add('hidden');
      grid.classList.remove('hidden');
      favs.forEach(p => grid.appendChild(createCard(p)));
    } catch (e) {
      console.error('Erro ao carregar favoritos:', e);
      emptyBox.classList.remove('hidden');
    }
  }

  function renderPlans() {
    const grid = qs('#plans-grid');
    if (!grid) return;
    grid.innerHTML = '';
    PLANS.forEach(plan => {
      const div = document.createElement('div');
      const isSelected = state.selectedPlan && state.selectedPlan.id === plan.id;
      div.className = `plan-card cursor-pointer transition-all ${isSelected ? 'selected' : ''}`;
      
      let content = '';
      if (plan.isPopular) {
        content += `<div class="popular-badge">Mais popular</div>`;
      }
      if (isSelected) {
        content += `<div class="selected-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>`;
      }
      
      content += `
        <h3 class="plan-name">${plan.name}</h3>
        <div class="plan-price-container">
          <span class="plan-currency">R$</span>
          <span class="plan-price-value">${plan.price}</span>
          <span class="plan-period">/mês</span>
        </div>
        <ul class="plan-features">
          ${plan.features.map(f => `<li>${f}</li>`).join('')}
        </ul>
        <button class="plan-buy-btn ${plan.isPopular ? 'btn-popular' : ''}">Comprar</button>
      `;
      
      div.innerHTML = content;
      div.onclick = () => selectPlan(plan);
      
      // Button click specifically opens checkout
      const btn = div.querySelector('.plan-buy-btn');
      btn.onclick = (e) => {
        e.stopPropagation();
        selectPlan(plan);
        openCheckout();
      };
      
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
      nameEl.textContent = `${plan.name} selecionado`;
      descEl.textContent = `${plan.priceFull} · ${plan.features[0]}`;
      banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function openCheckout() {
    const plan = state.selectedPlan;
    if (!plan) {
      alert('Por favor, selecione um plano primeiro!');
      return;
    }

    const content = qs('#modal-content');
    if (!content) return;

    content.innerHTML = `
      <div class="payment-modal">
        <div class="modal-header">
          <h2 class="modal-title">Assinar Plano</h2>
          <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        </div>
        
        <div class="payment-summary">
          <span class="payment-summary-label">Plano Selecionado</span>
          <div class="payment-summary-row">
            <span class="payment-summary-plan-name">${plan.name}</span>
            <span class="payment-summary-price">${plan.priceFull.split('/')[0]}</span>
          </div>
          <div class="payment-summary-feature">${plan.features[0]}</div>
        </div>

        <h3 class="payment-methods-title">Forma de pagamento</h3>
        <div class="payment-methods-list">
          <div class="payment-method-item" onclick="selectPaymentMethod(this, 'pix')">
            <div class="payment-method-icon">⚡</div>
            <div class="payment-method-info">
              <span class="payment-method-name">PIX</span>
              <span class="payment-method-desc">Aprovação imediata</span>
            </div>
          </div>
          <div class="payment-method-item" onclick="selectPaymentMethod(this, 'credit')">
            <div class="payment-method-icon">💳</div>
            <div class="payment-method-info">
              <span class="payment-method-name">Cartão de Crédito</span>
              <span class="payment-method-desc">Em até 12x</span>
            </div>
          </div>
          <div class="payment-method-item" onclick="selectPaymentMethod(this, 'boleto')">
            <div class="payment-method-icon">📄</div>
            <div class="payment-method-info">
              <span class="payment-method-name">Boleto Bancário</span>
              <span class="payment-method-desc">Vence em 3 dias úteis</span>
            </div>
          </div>
          <div class="payment-method-item" onclick="selectPaymentMethod(this, 'debit')">
            <div class="payment-method-icon">📱</div>
            <div class="payment-method-info">
              <span class="payment-method-name">Cartão de Débito</span>
              <span class="payment-method-desc">Débito online</span>
            </div>
          </div>
        </div>

        <button id="payment-submit-btn" class="payment-submit-btn" disabled onclick="finalizePayment()">
          <span>&rsaquo;</span> Selecione a forma de pagamento
        </button>
      </div>
    `;

    qs('#modal-container').classList.remove('hidden');
  }

  function selectPaymentMethod(element, method) {
    qsa('.payment-method-item').forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');
    
    const btn = qs('#payment-submit-btn');
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>&rsaquo;</span> Finalizar Pagamento`;
    }
    state.selectedPaymentMethod = method;
  }

  async function finalizePayment() {
    const plan = state.selectedPlan;
    if (!plan) {
      alert('Por favor, selecione um plano primeiro!');
      return;
    }
    try {
      const res = await apiPost('pagamento', 'criarCheckout', { 
        product_id: plan.id, 
        preco: plan.price 
      });
      if (res.success && res.checkout_url) {
        window.location.href = res.checkout_url;
      } else {
        alert('Erro ao criar checkout: ' + (res.error || 'Erro desconhecido'));
      }
    } catch (e) {
      alert('Erro na transação: ' + e.message);
    }
  }

  // --- Favorites ---
  async function toggleFavorite(id) {
    if (!state.user) {
      alert('Você precisa estar logado para favoritar animais!');
      navigateTo('login');
      return;
    }
    try {
      await apiPost('animal', 'favoritarAnimal', { petId: id });
      const idx = state.favorites.indexOf(id);
      if (idx === -1) state.favorites.push(id); else state.favorites.splice(idx, 1);
      localStorage.setItem('pa:favs', JSON.stringify(state.favorites));
      updateFavBadges();
    } catch (e) {
      alert('Erro ao favoritar animal: ' + e.message);
    }
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
            <img src="uploads/animais/${pet.photo}" alt="${pet.name}" class="w-full h-full object-cover">
          </div>
          <div class="pet-modal-info">
            <h3 class="pet-modal-title">${pet.name}</h3>
            <p class="pet-modal-subtitle">${pet.type || 'Animal'} • ${pet.breed || 'Raça não informada'} • ${calcAge(pet.birthDate)}</p>
            <p class="pet-modal-owner">Proprietário: ${pet.ownerName || 'Não informado'}</p>
            
            <div class="pet-details-grid">
              <div class="detail-item"><span>Cor:</span> ${pet.color || '-'}</div>
              <div class="detail-item"><span>Sexo:</span> ${pet.gender || '-'}</div>
              <div class="detail-item"><span>Porte:</span> ${pet.size || '-'}</div>
              <div class="detail-item"><span>Peso:</span> ${pet.weight || '-'}</div>
              <div class="detail-item"><span>Vacinado:</span> ${pet.vaccinated === 'Sim' ? '✅ Sim' : pet.vaccinated === 'Não' ? '❌ Não' : '-'}</div>
              <div class="detail-item"><span>Nasc:</span> ${formatDateBR(pet.birthDate)}</div>
            </div>

            ${pet.description ? `<p class="pet-description">${pet.description}</p>` : ''}
            
            <div class="pet-docs">
              ${pet.breedCert ? `<a href="${pet.breedCert}" target="_blank" class="doc-link">Certif. Raça</a>` : ''}
              ${pet.vaccinePhoto ? `<a href="${pet.vaccinePhoto}" target="_blank" class="doc-link">Foto Vacinas</a>` : ''}
              ${pet.certPhoto ? `<a href="${pet.certPhoto}" target="_blank" class="doc-link">Foto Certif.</a>` : ''}
            </div>

            <div class="pet-modal-actions">
              <button id="modal-fav" class="pet-modal-fav">Favoritar</button>
              <a id="modal-whatsapp" href="https://wa.me/5511999999999?text=Olá, tenho interesse no animal ${pet.name}" target="_blank" class="pet-modal-chat flex items-center justify-center gap-2">
                <img src="../../assets/img/whatsapp_icon.png" alt="WhatsApp" class="logo_whatsapp">WhatsApp
              </a>
            </div>
          </div>
        </div>
        <button onclick="closeModal()" class="pet-modal-close">Fechar</button>
      </div>
    `;
    qs('#modal-overlay').onclick = closeModal;
    qs('#modal-container').onclick = (e) => { if (e.target === modal) closeModal(); };
    qs('#modal-fav').addEventListener('click', () => { toggleFavorite(pet.id); renderFavoritesGrid(); });
  }

  function closeModal() { const modal = qs('#modal-container'); modal.classList.add('hidden'); modal.classList.remove('open'); qs('#modal-content').innerHTML = ''; }

  // --- Auth (very small simulation) ---
  async function handleLogin(e) {
    if (e) e.preventDefault();
    const cpf = qs('#login-cpf').value.trim();
    const pass = qs('#login-password').value.trim();
    if (!cpf || !pass) { qs('#login-error').classList.remove('hidden'); return; }
    
    try {
      const res = await apiPost('usuario', 'login', { cpf, senha: pass });
      state.user = res.usuario;
      localStorage.setItem('pa:user', JSON.stringify(state.user));
      qs('#login-error').classList.add('hidden');
      updateAuthUI();
      navigateTo('home');
    } catch (e) {
      qs('#login-error').classList.remove('hidden');
    }
  }


  async function handleRegister(e) {
    if (e) e.preventDefault();
    
    const name = qs('#reg-name').value.trim();
    const email = qs('#reg-email').value.trim();
    const cpf = qs('#reg-cpf').value.trim();
    const phone = qs('#reg-phone').value.trim();
    const cep = qs('#reg-cep').value.trim();
    const password = qs('#reg-password').value.trim();
    const termsCheck = qs('#reg-terms-check').checked;
    
    // Validações básicas no front
    if (!name || !email || !cpf || !phone || !cep || !password) { 
      showErrorAlert('Por favor, preencha todos os campos obrigatórios.');
      return; 
    }
    if (!termsCheck) {
      showErrorAlert('Você deve aceitar os Termos de Uso.');
      return;
    }
    
    try {
      const res = await apiPost('usuario', 'registerFromRequest', { nome: name, email, cpf, phone, cep, senha: password });
      alert('✅ Cadastro realizado com sucesso!');
      navigateTo('login');
    } catch (e) {
      showErrorAlert(e.message);
    }
  }

  function logout() { 
    state.user = null; 
    localStorage.removeItem('pa:user'); 
    updateAuthUI(); 
    navigateTo('home'); 
  }

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

  async function updateProfileUI() {
    if (!state.user) return;
    try {
      const user = await apiCall('usuario', 'read', { cpf: state.user.cpf });
      state.user = user;
      
      qs('#profile-name').textContent = user.nome || 'Usuário';
      qs('#profile-email').textContent = user.email || 'email@exemplo.com';
      
      qs('#profile-name-detail').textContent = user.nome || '-';
      qs('#profile-email-detail').textContent = user.email || '-';
      qs('#profile-cpf').textContent = user.cpf || '-';
      qs('#profile-cep').textContent = user.cep || '-';
      qs('#profile-phone').textContent = user.phone || '-';
      
      const avatarContainer = qs('#profile-avatar-container');
      if (avatarContainer && user.imagem) {
        avatarContainer.innerHTML = `<img src="uploads/${user.imagem}" class="avatar-img">`;
      }
    } catch (e) {
      console.error('Erro ao atualizar perfil:', e);
    }
  }

  function toggleProfileEdit() {
    const details = qs('#profile-details');
    const form = qs('#profile-edit-form');
    const btn = qs('#profile-edit-btn');

    const isEditing = form.classList.toggle('hidden');
    details.classList.toggle('hidden');

    if (!isEditing) {
      // Entering edit mode
      btn.textContent = 'Cancelar';
      qs('#edit-name').value = state.user?.nome || '';
      qs('#edit-email').value = state.user?.email || '';
      qs('#edit-cpf').value = state.user?.cpf || '';
      qs('#edit-cep').value = state.user?.cep || '';
      qs('#edit-phone').value = state.user?.phone || '';
      qs('#edit-password').value = '';
    } else {
      // Returning to view mode
      btn.textContent = 'Editar';
    }
  }

  async function saveProfile() {
    if (!state.user) return;
    
    const data = {
      nome: qs('#edit-name').value.trim(),
      email: qs('#edit-email').value.trim(),
      cpf: qs('#edit-cpf').value.trim(),
      cep: qs('#edit-cep').value.trim(),
      phone: qs('#edit-phone').value.trim(),
      senha: qs('#edit-password').value.trim()
    };
    
    if (!data.nome || !data.email || !data.cpf || !data.cep || !data.phone) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    try {
      await apiPost('usuario', 'updateUsuarioFromRequest', data);
      await updateProfileUI();
      toggleProfileEdit();
      alert('Perfil atualizado com sucesso!');
    } catch (e) {
      alert('Erro ao salvar perfil: ' + e.message);
    }
  }


  // Export to window for HTML onclick handlers
  window.navigateTo = navigateTo;
  window.logout = logout;
  window.openTermsModal = openTermsModal;
  window.closeTermsModal = closeTermsModal;
  window.openPrivacyModal = openPrivacyModal;
  window.acceptTerms = acceptTerms;
  window.handleTermsModalScroll = handleTermsModalScroll;
  window.handleRegAvatar = handleRegAvatar;
  window.handleLogin = handleLogin;
  window.handleRegister = handleRegister;
  window.toggleTheme = toggleTheme;
  window.openCheckout = openCheckout;
  window.openPetModal = openPetModal;
  window.closeModal = closeModal;
  window.openRegisterAnimalModal = openRegisterAnimalModal;
  window.handleProfileAvatar = handleProfileAvatar;
  window.toggleProfileEdit = toggleProfileEdit;
  window.saveProfile = saveProfile;
  window.scrollToSection = scrollToSection;

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

  async function renderMyAnimals() {
    const grid = qs('#my-animals-grid');
    const empty = qs('#my-animals-empty');
    if (!grid || !empty) return;
    grid.innerHTML = '';
    try {
      const myPets = await apiCall('animal', 'readByDonoId', { donoId: state.user?.cpf || '' });
      if (myPets.length === 0) {
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');
      myPets.forEach(pet => {
        grid.appendChild(createCard(pet));
      });
    } catch (e) {
      console.error('Erro ao carregar meus animais:', e);
      empty.classList.remove('hidden');
    }
  }


  async function renderMatches() {
    const grid = qs('#matches-grid');
    const empty = qs('#matches-empty');
    if (!grid || !empty) return;
    grid.innerHTML = '';
    try {
      const matches = await apiCall('animal', 'buscarAnimais', { termo: '', usuarioId: state.user?.cpf || '' });
      if (matches.length === 0) {
        empty.classList.remove('hidden');
        return;
      }
      empty.classList.add('hidden');
      matches.forEach(pet => {
        grid.appendChild(createCard(pet));
      });
    } catch (e) {
      console.error('Erro ao carregar matches:', e);
      empty.classList.remove('hidden');
    }
  }


  function handleRegisterAnimalScroll(event) {
    const contentDiv = event.target;
    const isAtBottom = contentDiv.scrollHeight - contentDiv.scrollTop - contentDiv.clientHeight < 15;
    if (isAtBottom) {
      const btn = qs('#reg-submit-btn');
      if (btn) btn.disabled = false;
    }
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
          <div id="reg-form-scroll" class="reg-form-scroll">
            <div class="form-group">
              <label class="form-label">Tutor</label>
              <input type="text" class="form-input" value="${state.user?.nome || 'Usuário não logado'}" readonly>
            </div>
            <div class="form-group">
              <label class="form-label">Nome do Pet</label>
              <input name="petName" type="text" required class="form-input" placeholder="Ex: Max">
            </div>
            <div class="form-group">
              <label class="form-label">Tipo/Espécie</label>
              <input name="type" type="text" required class="form-input" placeholder="Ex: Cachorro">
            </div>
            <div class="form-group">
              <label class="form-label">Raça</label>
              <input name="breed" type="text" class="form-input" placeholder="Ex: Golden Retriever">
            </div>
            <div class="form-group">
              <label class="form-label">Cor</label>
              <input name="color" type="text" class="form-input" placeholder="Ex: Dourado">
            </div>
            <div class="form-group">
              <label class="form-label">Sexo</label>
              <select name="gender" class="form-input">
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Porte</label>
              <select name="size" class="form-input">
                <option value="Pequeno">Pequeno</option>
                <option value="Médio">Médio</option>
                <option value="Grande">Grande</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Data de Nascimento</label>
              <input name="birthDate" type="date" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Peso</label>
              <input name="weight" type="text" class="form-input" placeholder="Ex: 10 kg">
            </div>
            <div class="form-group">
              <label class="form-label">Descrição</label>
              <textarea name="description" class="form-input" rows="3" placeholder="Conte mais sobre o pet..."></textarea>
            </div>
            <div class="form-group">
              <label class="form-label">Vacinado?</label>
              <select name="vaccinated" class="form-input">
                <option value="Sim">Sim</option>
                <option value="Não">Não</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Foto do Pet</label>
              <input name="photo" type="file" accept="image/*" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Certificado de Raça</label>
              <input name="breedCert" type="file" class="form-input">
            </div>
            <div class="form-group">
              <label class="form-label">Foto Vacinas</label>
              <input name="vaccinePhoto" type="file" class="form-input">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" onclick="closeModal()" class="btn-secondary flex-1">Cancelar</button>
            <button id="reg-submit-btn" type="submit" class="btn-primary flex-1" disabled>Cadastrar</button>
          </div>
        </form>
      </div>
    `;
    container.classList.remove('hidden');
    qs('#reg-form-scroll').addEventListener('scroll', handleRegisterAnimalScroll);
  }



  async function handleAnimalRegister(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    try {
      await apiPost('animal', 'criarAnimal', formData);
      closeModal();
      renderMyAnimals();
      renderHomeGrid();
      alert('Animal cadastrado com sucesso!');
    } catch (e) {
      alert('Erro ao cadastrar animal: ' + e.message);
    }
  }

  // --- Mobile menu ---
  function toggleMenu() {
    const m = qs('#mobile-menu');
    const icon = qs('#menu-icon');

    if (m) {
      const isHidden = m.classList.toggle('hidden');
      if (icon) {
        icon.classList.toggle('lucide-menu', isHidden);
        icon.classList.toggle('lucide-x', !isHidden);
      }
    }
  }

  function closeMenu() {
    const m = qs('#mobile-menu');
    const icon = qs('#menu-icon');
    if (m) m.classList.add('hidden');
    if (icon) {
      icon.classList.add('lucide-menu');
      icon.classList.remove('lucide-x');
    }
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
    window.selectPaymentMethod = selectPaymentMethod;
    window.finalizePayment = finalizePayment;
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
    // Funções de termos de uso
    window.openTermsModal = openTermsModal;
    window.openPrivacyModal = openPrivacyModal;
    window.closeTermsModal = closeTermsModal;
    window.closePrivacyModal = closePrivacyModal;
    window.acceptTerms = acceptTerms;
    window.handleTermsModalScroll = handleTermsModalScroll;
    // attach file handlers where used
    qs('#auth-btn')?.addEventListener('click', () => navigateTo('login'));
    qs('#auth-btn-mobile')?.addEventListener('click', () => navigateTo('login'));
    qs('#logout-btn')?.addEventListener('click', logout);

    // Adicionar listener para scroll do modal de termos
    const termsContentDiv = qs('#terms-content-text');
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
