document.addEventListener("DOMContentLoaded", async () => {
    const API_URL_ANIMAIS = window.API_URL_ANIMAIS || "/backEnd/home.php?route=animais";
    const container = document.getElementById("animais-container");
    const buscaInput = document.getElementById("busca-input");
    let matchStatusMap = {};

    if (!container) {
        console.error("Elemento #animais-container não encontrado.");
        return;
    }

    const filtroCheckboxes = document.querySelectorAll(".filtro-check");
    const btnFiltros = document.getElementById("btn-filtros");
    const filtrosDropdown = document.getElementById("filtros-dropdown");
    const btnLimparFiltros = document.getElementById("btn-limpar-filtros");

    let debounceTimer;

    function getFiltrosAtivos() {
        const filtros = {};
        filtroCheckboxes.forEach(cb => {
            if (cb.checked) {
                const chave = cb.dataset.filtro;
                if (!filtros[chave]) filtros[chave] = [];
                filtros[chave].push(cb.value);
            }
        });
        return filtros;
    }

    function montarUrlBusca() {
        const termo = buscaInput ? buscaInput.value.trim() : "";
        const filtros = getFiltrosAtivos();
        const params = new URLSearchParams();
        params.set("route", "buscar_animais");
        if (termo) params.set("termo", termo);
        Object.keys(filtros).forEach(chave => {
            params.set(chave, filtros[chave].join(","));
        });
        return "/backEnd/home.php?" + params.toString();
    }

    function executarBusca() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            const url = montarUrlBusca();
            const temFiltros = url.includes("termo=") || url.includes("porte=") || url.includes("cor=") || url.includes("tipo=") || url.includes("vacinado=") || url.includes("certificado=");
            if (!temFiltros) {
                carregarAnimais();
                return;
            }
            try {
                const response = await fetch(url, { credentials: 'same-origin' });
                if (!response.ok) throw new Error(`Erro na busca: ${response.status}`);
                const data = await response.json();
                const animais = Array.isArray(data) ? data : data.animais || [];
                renderizarAnimais(animais);
            } catch (error) {
                console.error("Erro ao buscar animais:", error);
            }
        }, 300);
    }

    if (buscaInput) {
        buscaInput.addEventListener("input", executarBusca);
    }

    filtroCheckboxes.forEach(cb => {
        cb.addEventListener("change", executarBusca);
    });

    if (btnFiltros && filtrosDropdown) {
        btnFiltros.addEventListener("click", () => {
            const aberto = filtrosDropdown.style.display === "block";
            filtrosDropdown.style.display = aberto ? "none" : "block";
        });
        document.addEventListener("click", (e) => {
            if (!btnFiltros.contains(e.target) && !filtrosDropdown.contains(e.target)) {
                filtrosDropdown.style.display = "none";
            }
        });
    }

    if (btnLimparFiltros) {
        btnLimparFiltros.addEventListener("click", () => {
            filtroCheckboxes.forEach(cb => cb.checked = false);
            if (buscaInput) buscaInput.value = "";
            filtrosDropdown.style.display = "none";
            carregarAnimais();
        });
    }

    function renderizarAnimais(animais) {
        if (animais.length === 0) {
            container.innerHTML = "<p>Nenhum animal encontrado.</p>";
            return;
        }

        container.innerHTML = "";

        animais.forEach(animal => {
            const card = document.createElement("article");
            const fotoAnimal = (animal.foto_pet || "placeholder.webp").toString().trim() || "placeholder.webp";
            card.classList.add("animal-card");
                card.innerHTML = `
                <img src="/uploads/animais/${fotoAnimal}" alt="${animal.nome || 'Animal'}" class="animal-image" style="max-width: 10rem; height: 10rem; object-fit: cover;" onerror="this.onerror=null;this.src='/uploads/animais/placeholder.webp'">
                <h3>${animal.nome || "Sem nome"}</h3>
                <p>${animal.descricao || "Não informada"}</p>
                <p>${animal.tipo || "Não informado"}</p>
                <p>${animal.porte || "Não informado"}</p>
                <p>${animal.sexo || "Não informado"}</p>
                <button type="button" class="detalhes-btn" data-animal-id="${animal.id}">Ver Detalhes</button>
                <button type="button" class="favoritar-btn" data-animal-id="${animal.id}">${animal.favoritado===true ? "Remover dos Favoritos" : "Favoritar"}</button>
                ${window.EH_ADMIN ? `<button type="button" class="excluir-btn" data-animal-id="${animal.id}">Excluir</button>` : ""}
            `;
            container.appendChild(card);
        });
    }

    async function carregarMatchStatus() {
        try {
            const response = await fetch("/backEnd/match.php?route=minhas_solicitacoes", { credentials: "same-origin" });
            const data = await response.json();
            if (data.sucesso && data.solicitacoes) {
                data.solicitacoes.forEach(s => {
                    matchStatusMap[s.pet_id] = { status: s.status, solicitacao_id: s.id };
                });
            }
        } catch (error) {
            console.error("Erro ao carregar status dos matchs:", error);
        }
    }

    async function carregarAnimais() {
        try {
            const response = await fetch(API_URL_ANIMAIS, { credentials: 'same-origin' });
            if (!response.ok) {
                throw new Error(`Erro ao buscar lista de animais: ${response.status}`);
            }

            const data = await response.json();

            if (data.erro) {
                throw new Error(data.erro);
            }

            const animais = Array.isArray(data) ? data : data.animais || [];

            renderizarAnimais(animais);
            if (animais.length === 0) {
                container.innerHTML = "<p>Você ainda não tem nenhum animal favoritado.</p>";
                return;
            }

            container.innerHTML = "";

            animais.forEach(animal => {
                const card = document.createElement("article");
                const fotoAnimal = (animal.foto_pet || "placeholder.webp").toString().trim() || "placeholder.webp";
                card.classList.add("animal-card");
                    var matchHtml = "";
                    if (animal.dono_id != window.USUARIO_ID) {
                        if (matchStatusMap[animal.id]) {
                            if (matchStatusMap[animal.id].status === 'aceito') {
                                matchHtml = '<a href="/backEnd/chat.php?solicitacao_id=' + matchStatusMap[animal.id].solicitacao_id + '" class="btn-chat-home">Iniciar Chat</a>';
                            } else if (matchStatusMap[animal.id].status === 'pendente') {
                                matchHtml = '<button type="button" class="match-btn" disabled>Pendente</button>';
                            } else {
                                matchHtml = '<button type="button" class="match-btn" data-animal-id="' + animal.id + '">Enviar Match</button>';
                            }
                        } else {
                            matchHtml = '<button type="button" class="match-btn" data-animal-id="' + animal.id + '">Enviar Match</button>';
                        }
                    }

                    var adminBtn = window.EH_ADMIN ? '<button type="button" class="excluir-btn" data-animal-id="' + animal.id + '">Excluir</button>' : "";

                    card.innerHTML = `
                    <img src="/uploads/animais/${fotoAnimal}" alt="${animal.nome || 'Animal'}" class="animal-image" style="max-width: 10rem; height: 10rem; object-fit: cover;" onerror="this.onerror=null;this.src='/uploads/animais/placeholder.webp'">
                    <h3>${animal.nome || "Sem nome"}</h3>
                    <p>${animal.descricao || "Não informada"}</p>
                    <p>${animal.tipo || "Não informado"}</p>
                    <p>${animal.porte || "Não informado"}</p>
                    <p>${animal.sexo || "Não informado"}</p>
                    <button type="button" class="detalhes-btn" data-animal-id="${animal.id}">Ver Detalhes</button>
                    <button type="button" class="favoritar-btn" data-animal-id="${animal.id}">${animal.favoritado===true ? "Remover dos Favoritos" : "Favoritar"}</button>
                    ${adminBtn}
                    ${matchHtml}
                `;
                container.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar animais:", error);
            container.innerHTML = "<p>Não foi possível carregar os animais.</p>";
        }
    }

    container.addEventListener("click", async (event) => {
        const target = event.target;
        const button = target instanceof Element ? target.closest(".favoritar-btn") : null;
        if (button) {
            const animalId = button.dataset.animalId;
            if (animalId) {
                const estaFavoritado = button.textContent.trim() === "Remover dos Favoritos";
                button.textContent = estaFavoritado ? "Favoritar" : "Remover dos Favoritos";
                try {
                    fetch(`/backEnd/home.php?route=favoritar_animal&idAnimal=${animalId}`);
                } catch (error) {
                    console.error("Erro ao buscar dados do animal:", error);
                }
            }
            return;
        }

        const matchBtn = target instanceof Element ? target.closest(".match-btn") : null;
        if (!matchBtn) return;

        const animalId = matchBtn.dataset.animalId;
        if (!confirm("Enviar solicitação de match para este animal?")) return;

        try {
            const response = await fetch("/backEnd/match.php?route=enviar", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pet_id: animalId, remetente_id: window.USUARIO_ID }),
                credentials: "same-origin"
            });
            const data = await response.json();
            if (data.sucesso) {
                alert(data.mensagem);
                matchStatusMap[animalId] = "pendente";
                matchBtn.textContent = "Pendente";
                matchBtn.disabled = true;
            } else {
                alert("Erro: " + (data.erro || "Erro desconhecido"));
            }
        } catch (error) {
            alert("Erro de conexão.");
        }
    });

    container.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }
    
        const detalhesBtn = target.closest(".detalhes-btn");
        if (detalhesBtn) {
            carregarDetalhesAnimal(detalhesBtn.dataset.animalId);
            return;
        }
    
        const excluirBtn = target.closest(".excluir-btn");
        if (excluirBtn) {
            excluirAnimal(excluirBtn.dataset.animalId);
            return;
        }
        
    });

    function getModalElement() {
        let modal = document.getElementById("animais-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "animais-modal";
            document.body.appendChild(modal);
        }
        return modal;
    }

    function closeModal(modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }

    function openModal(contentHtml) {
        const modal = getModalElement();
        const body = document.body;

        body.style.overflow = "hidden";
        modal.style.position = "fixed";
        modal.style.top = "0";
        modal.style.left = "0";
        modal.style.width = "100%";
        modal.style.height = "100%";
        modal.style.display = "flex";
        modal.style.alignItems = "center";
        modal.style.justifyContent = "center";
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        modal.style.zIndex = "9999";
        modal.innerHTML = contentHtml;

        const closeButton = modal.querySelector(".modal-close");
        if (closeButton) {
            closeButton.onclick = () => closeModal(modal);
        }

        modal.onclick = (event) => {
            if (event.target === modal) {
                closeModal(modal);
            }
        };
    }

    async function carregarDetalhesAnimal(animalId) {
        try {
            const response = await fetch(`/backEnd/home.php?route=detalhes_animal&id=${animalId}`, { credentials: 'same-origin' });
            if (!response.ok) {
                throw new Error(`Erro ao buscar detalhes do animal: ${response.status}`);
            }

            const data = await response.json();
            if (!data || data.erro) {
                throw new Error(data?.erro || "Detalhes do animal não foram encontrados.");
            }

            const animal = Array.isArray(data) ? data[0] : data;
            if (!animal) {
                throw new Error("Animal inválido recebido do servidor.");
            }

            const fotoAnimal = (animal.foto_pet || "placeholder.webp").toString().trim() || "placeholder.webp";
            openModal(`
                <div class="modal-content">
                    <button type="button" class="modal-close">×</button>
                    <img src="/uploads/animais/${fotoAnimal}" alt="Foto de ${animal.nome || 'Animal'}" style="max-width: 10rem; height: 10rem; object-fit: cover;" class="modal-animal-image" onerror="this.onerror=null;this.src='/uploads/animais/placeholder.webp'">
                    <h3>${animal.nome || "Sem nome"}</h3>
                    <p><strong>Data de Nascimento:</strong> ${animal.data_nascimento || "Não informada"}</p>
                    <p><strong>Descrição:</strong> ${animal.descricao || "Não informada"}</p>
                    <p><strong>Sexo:</strong> ${animal.sexo || "Não informado"}</p>
                    <p><strong>Raça:</strong> ${animal.raca || "Não informada"}</p>
                    <p><strong>Tipo:</strong> ${animal.tipo  || "Não informado"}</p>
                    <p><strong>Peso:</strong> ${animal.peso || "Não informado"} Kg</p>
                    <p><strong>Vacinado:</strong> ${animal.vacinado == 1 ? "Sim" : "Não"}</p>
                    <p><strong>Certificado:</strong> ${animal.certificado == 1 ? "Sim" : "Não"}</p>
                    <p><strong>Porte:</strong> ${animal.porte || "Não informado"}</p>
                    <p><strong>Cor:</strong> ${animal.cor || "Não informada"}</p>
                    <button type="button" onclick="window.location.href='/backEnd/denuncias/cadastrarDenuncia.php?tipo=animal&id=${animal.id}'" >Reportar</button>

                </div>
            `);
        } catch (error) {
            console.error("Erro ao carregar detalhes do animal:", error);
        }
    }

    async function excluirAnimal(id) {
        if (!confirm("Deseja realmente excluir este animal?")) {
            return;
        }
    
        try {
            const response = await fetch(`/backEnd/home.php?route=excluir_animal&id=${id}`, {
                method: "DELETE",
                credentials: "same-origin"
            });
    
            const data = await response.json();
    
            if (data.sucesso) {
                alert("Animal excluído com sucesso!");
                carregarAnimais();
            } else {
                alert(data.erro || "Erro ao excluir o animal.");
            }
    
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir o animal.");
        }
    }

    await carregarMatchStatus();
    carregarAnimais();
});