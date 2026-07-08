document.addEventListener("DOMContentLoaded", () => {
    const API_URL_MEUS_ANIMAIS = `/backEnd/animal/meusAnimais.php?route=animais`;
    const container = document.getElementById("animais-container");

    if (!container) {
        console.error("Elemento #animais-container não encontrado.");
        return;
    }

    let meusDestaquesIds = new Set();

    async function carregarMeusDestaques() {
        try {
            const res = await fetch('/backEnd/home.php?route=meus_destaques_ids');
            if (!res.ok) return;
            const data = await res.json();
            if (Array.isArray(data)) {
                meusDestaquesIds = new Set(data);
            }
        } catch (e) {
            console.error('Erro ao carregar destaques:', e);
        }
    }

    async function carregarMeusAnimais() {
        try {
            const response = await fetch(API_URL_MEUS_ANIMAIS);
            if (!response.ok) {
                throw new Error(`Erro ao buscar seus animais: ${response.status}`);
            }

            const data = await response.json();

            if (data.erro) {
                throw new Error(data.erro);
            }

            const animais = Array.isArray(data) ? data : data.animais || [];

            container.innerHTML = "";

            if (animais.length === 0) {
                container.innerHTML = "<p>Você ainda não tem nenhum animal cadastrado.</p>";
                return;
            }

            await carregarMeusDestaques();

            function getCarrosselHtml(animal) {
                const fotos = (animal.fotos && animal.fotos.length > 0) ? animal.fotos : ["placeholder.webp"];
                const fotosJson = JSON.stringify(fotos).replace(/</g, "\\u003C");
                const imgs = fotos.map(f =>
                    '<img src="/uploads/animais/' + f + '" alt="Foto" onerror="this.onerror=null;this.src=\'/uploads/animais/placeholder.webp\'">'
                ).join('');
                return '<div class="animal-fotos-carrossel" data-fotos=\'' + fotosJson + '\'><div class="carrossel-track">' + imgs + '</div></div>';
            }

            function carregarCarrosselEventos(card) {
                const carrossel = card.querySelector('.animal-fotos-carrossel');
                if (!carrossel) return;
                let fotos = [];
                try { fotos = JSON.parse(carrossel.dataset.fotos); } catch(e) {}
                if (fotos.length <= 1) return;
                let intervalo = null;
                let idx = 0;
                carrossel.addEventListener('mouseenter', function() {
                    const track = this.querySelector('.carrossel-track');
                    if (!track) return;
                    intervalo = setInterval(function() {
                        idx = (idx + 1) % fotos.length;
                        track.style.transform = 'translateX(-' + (idx * 100) + '%)';
                    }, 1800);
                });
                carrossel.addEventListener('mouseleave', function() {
                    clearInterval(intervalo);
                    intervalo = null;
                    idx = 0;
                    const track = this.querySelector('.carrossel-track');
                    if (track) track.style.transform = 'translateX(0)';
                });
            }

            animais.forEach(animal => {
                const card = document.createElement("article");
                card.classList.add("animal-card");
                const estaDestacado = meusDestaquesIds.has(animal.id);
                const textoBotao = estaDestacado ? "Remover Destaque" : "Destacar";
                const classeBotao = estaDestacado ? "remover-destaque-btn" : "destacar-btn";
                card.innerHTML =
                    getCarrosselHtml(animal) +
                    '<h3>' + (animal.nome || "Sem nome") + '</h3>' +
                    '<p>' + (animal.descricao || "Não informada") + '</p>' +
                    '<p>' + (animal.tipo || "Não informado") + '</p>' +
                    '<p>' + (animal.porte || "Não informado") + '</p>' +
                    '<p>' + (animal.sexo || "Não informado") + '</p>' +
                    '<button type="button" class="detalhes-btn" data-animal-id="' + animal.id + '">Ver Detalhes</button>' +
                    '<button type="button" class="' + classeBotao + '" data-animal-id="' + animal.id + '" data-nome="' + (animal.nome || 'Animal') + '">' + textoBotao + '</button>' +
                    '<button type="button" class="editar-btn" data-animal-id="' + animal.id + '" style="margin-left:0.25rem;">Editar</button>';
                container.appendChild(card);
                carregarCarrosselEventos(card);
            });
        } catch (error) {
            console.error("Erro ao carregar seus animais:", error);
            container.innerHTML = "<p>Não foi possível carregar seus animais.</p>";
        }
    }

    container.addEventListener("click", (event) => {
        const target = event.target;
        const button = target instanceof Element ? target.closest(".favoritar-btn") : null;
        if (!button) {
            return;
        }

        const animalId = button.dataset.animalId;
        if (animalId) {
            const estaFavoritado = button.textContent.trim() === "Remover dos Favoritos";
            button.textContent = estaFavoritado ? "Favoritar" : "Remover dos Favoritos";

            try {
                fetch(`/backEnd/animal/meusAnimais.php?route=detalhes_animal&id=${animalId}`);
            } catch (error) {
                console.error("Erro ao buscar dados do animal:", error);
            }
        }
    });

    container.addEventListener("click", (event) => {
        const target = event.target;
        const button = target instanceof Element ? target.closest(".detalhes-btn") : null;
        if (!button) {
            return;
        }

        const animalId = button.dataset.animalId;
        if (animalId) {
            carregarDetalhesAnimal(animalId);
        }
    });

    container.addEventListener("click", (event) => {
        const target = event.target;
        const btn = target instanceof Element ? target.closest(".editar-btn") : null;
        if (!btn) return;
        const animalId = btn.dataset.animalId;
        if (animalId) {
            window.location.href = '/backEnd/animal/editarAnimal.php?id=' + animalId;
        }
    });

    container.addEventListener("click", async (event) => {
        const target = event.target;
        const button = target instanceof Element ? target.closest(".destacar-btn, .remover-destaque-btn") : null;
        if (!button) return;

        const animalId = button.dataset.animalId;
        const nome = button.dataset.nome || "Animal";
        const isRemover = button.classList.contains("remover-destaque-btn");

        if (isRemover) {
            if (!confirm(`Tem certeza que deseja remover o destaque de ${nome}?`)) return;

            const res = await fetch('/backEnd/home.php?route=remover_destaque', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animal_id: animalId })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message || "Destaque removido.");
                carregarMeusAnimais();
            } else {
                alert(data.error || "Erro ao remover destaque.");
            }
        } else {
            if (!confirm(`Tem certeza que deseja destacar ${nome}?`)) return;

            const res = await fetch('/backEnd/home.php?route=destacar_animal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ animal_id: animalId })
            });
            const data = await res.json();
            if (data.success) {
                alert(data.message || "Animal destacado com sucesso!");
                carregarMeusAnimais();
            } else {
                alert(data.error || "Erro ao destacar animal.");
            }
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
        modal.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
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
            const response = await fetch(`/backEnd/animal/meusAnimais.php?route=detalhes_animal&id=${animalId}`, { credentials: 'same-origin' });
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

            const fotos = (animal.fotos && animal.fotos.length > 0) ? animal.fotos : ["placeholder.webp"];
            const fotosJson = JSON.stringify(fotos).replace(/</g, "\\u003C");
            const imgsHtml = fotos.map(function(f) {
                return '<img src="/uploads/animais/' + f + '" alt="Foto" onerror="this.onerror=null;this.src=\'/uploads/animais/placeholder.webp\'">';
            }).join('');

            var galeriaHtml = '<div class="modal-gallery" data-fotos=\'' + fotosJson + '\' data-index="0">' +
                '<div class="gallery-track">' + imgsHtml + '</div>';
            if (fotos.length > 1) {
                galeriaHtml += '<button type="button" class="gallery-prev">&#10094;</button>' +
                               '<button type="button" class="gallery-next">&#10095;</button>';
            }
            galeriaHtml += '</div>';

            openModal(`
                <div class="modal-content">
                    <button type="button" class="modal-close">×</button>
                    ${galeriaHtml}
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
                </div>
            `);

            setTimeout(function() {
                var modal = document.getElementById('animais-modal');
                if (!modal) return;
                var galeria = modal.querySelector('.modal-gallery');
                if (!galeria) return;
                var track = galeria.querySelector('.gallery-track');
                if (!track) return;
                var imgs = track.querySelectorAll('img');
                if (imgs.length <= 1) return;
                var prevBtn = galeria.querySelector('.gallery-prev');
                var nextBtn = galeria.querySelector('.gallery-next');
                var idx = 0;
                function atualizarGaleria() {
                    track.style.transform = 'translateX(-' + (idx * 100) + '%)';
                }
                if (nextBtn) {
                    nextBtn.addEventListener('click', function() {
                        idx = (idx + 1) % imgs.length;
                        atualizarGaleria();
                    });
                }
                if (prevBtn) {
                    prevBtn.addEventListener('click', function() {
                        idx = (idx - 1 + imgs.length) % imgs.length;
                        atualizarGaleria();
                    });
                }
            }, 0);
        } catch (error) {
            console.error("Erro ao carregar detalhes do animal:", error);
        }
    }

    carregarMeusAnimais();
});
