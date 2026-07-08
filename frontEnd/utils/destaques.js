document.addEventListener("DOMContentLoaded", () => {
    let matchStatusMap = {};

    async function carregarMatchStatus() {
        try {
            const resp = await fetch("/backEnd/match.php?route=minhas_solicitacoes", { credentials: "same-origin" });
            const data = await resp.json();
            if (data.sucesso && data.solicitacoes) {
                data.solicitacoes.forEach(s => {
                    matchStatusMap[s.pet_id] = { status: s.status, solicitacao_id: s.id };
                });
            }
        } catch (e) {
            console.error("Erro ao carregar status dos matchs:", e);
        }
    }

    function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

async function carregarDestaques() {
        try {
            const resp = await fetch('/backEnd/home.php?route=animais_destaque');
            const animais = await resp.json();
            const container = document.getElementById('destaques-container');
            if (!animais || animais.length === 0) {
                container.innerHTML = '<div style="min-width:100%;text-align:center;color:#999;padding:1rem;">Nenhum animal em destaque no momento.</div>';
                return;
            }
            container.innerHTML = animais.map(a => {
                const foto = a.foto_pet || 'placeholder.webp';
                return '<div style="min-width:180px;flex-shrink:0;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);overflow:hidden;cursor:pointer;" onclick="destaquesVerDetalhes(' + escapeHtml(a.id) + ')">' +
                    '<img src="/uploads/animais/' + escapeHtml(foto) + '" alt="' + escapeHtml(a.nome || '') + '" style="width:100%;height:140px;object-fit:cover;">' +
                    '<div style="padding:0.5rem;">' +
                        '<strong style="color:#244C4E;">' + escapeHtml(a.nome || '') + '</strong>' +
                        '<p style="font-size:0.8rem;color:#666;margin:0;">' + escapeHtml(a.raca || a.tipo || '') + '</p>' +
                    '</div>' +
                '</div>';
            }).join('');
        } catch (e) {
            const container = document.getElementById('destaques-container');
            if (container) {
                container.innerHTML = '<div style="min-width:100%;text-align:center;color:#999;padding:1rem;">Erro ao carregar destaques.</div>';
            }
        }
    }

    window.destaquesVerDetalhes = async function(animalId) {
        try {
            const resp = await fetch('/backEnd/home.php?route=detalhes_animal&id=' + animalId);
            const data = await resp.json();
            const animal = Array.isArray(data) ? data[0] : data;
            if (!animal) return;

            const fotos = (animal.fotos && animal.fotos.length > 0) ? animal.fotos : ["placeholder.webp"];
            const donoId = animal.dono_id;
            const isOwner = donoId == window.USUARIO_ID;

            var favoritarBtnText = animal.favoritado ? 'Remover dos Favoritos' : 'Favoritar';
            var favoritarHtml = '<button type="button" class="favoritar-btn" data-animal-id="' + animal.id + '">' + favoritarBtnText + '</button>';

            let matchHtml = '';
            if (!isOwner) {
                const matchInfo = matchStatusMap[animal.id];
                if (matchInfo) {
                    if (matchInfo.status === 'aceito') {
                        matchHtml = '<a href="/backEnd/chat.php?solicitacao_id=' + matchInfo.solicitacao_id + '" class="btn-chat-home">Iniciar Chat</a>';
                    } else if (matchInfo.status === 'pendente') {
                        matchHtml = '<button type="button" class="match-btn" disabled>Pendente</button>';
                    } else {
                        matchHtml = '<button type="button" class="match-btn" data-animal-id="' + animal.id + '">Enviar Match</button>';
                    }
                } else {
                    matchHtml = '<button type="button" class="match-btn" data-animal-id="' + animal.id + '">Enviar Match</button>';
                }
            }

            const modal = document.getElementById('animais-modal') || (() => {
                const el = document.createElement('div');
                el.id = 'animais-modal';
                document.body.appendChild(el);
                return el;
            })();

            document.body.style.overflow = 'hidden';
            modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.3);z-index:9999;';

            var galeriaHtml = '<div class="modal-gallery" data-fotos=\'' + JSON.stringify(fotos).replace(/</g, '\\u003C') + '\' data-index="0">' +
                '<div class="gallery-track">' +
                    fotos.map(function(f) {
                        return '<img src="/uploads/animais/' + f + '" alt="Foto" onerror="this.onerror=null;this.src=\'/uploads/animais/placeholder.webp\'">';
                    }).join('') +
                '</div>';
            if (fotos.length > 1) {
                galeriaHtml += '<button type="button" class="gallery-prev">&#10094;</button>' +
                               '<button type="button" class="gallery-next">&#10095;</button>';
            }
            galeriaHtml += '</div>';

            modal.innerHTML = '<div class="modal-content">' +
                '<button type="button" class="modal-close" onclick="this.closest(\'#animais-modal\').style.display=\'none\';document.body.style.overflow=\'auto\';">x</button>' +
                galeriaHtml +
                '<h3>' + (animal.nome || 'Sem nome') + '</h3>' +
                '<p><strong>Data de Nascimento:</strong> ' + (animal.data_nascimento || 'Nao informada') + '</p>' +
                '<p><strong>Descricao:</strong> ' + (animal.descricao || 'Nao informada') + '</p>' +
                '<p><strong>Sexo:</strong> ' + (animal.sexo || 'Nao informado') + '</p>' +
                '<p><strong>Raca:</strong> ' + (animal.raca || 'Nao informada') + '</p>' +
                '<p><strong>Tipo:</strong> ' + (animal.tipo || 'Nao informado') + '</p>' +
                '<p><strong>Peso:</strong> ' + (animal.peso || 'Nao informado') + ' Kg</p>' +
                '<p><strong>Vacinado:</strong> ' + (animal.vacinado == 1 ? 'Sim' : 'Nao') + '</p>' +
                '<p><strong>Certificado:</strong> ' + (animal.certificado == 1 ? 'Sim' : 'Nao') + '</p>' +
                '<p><strong>Porte:</strong> ' + (animal.porte || 'Nao informado') + '</p>' +
                '<p><strong>Cor:</strong> ' + (animal.cor || 'Nao informada') + '</p>' +
                '<div style="display:flex;gap:0.5rem;margin-top:0.75rem;flex-wrap:wrap;">' +
                    matchHtml +
                    favoritarHtml +
                    '<button type="button" onclick="window.location.href=\'/backEnd/denuncias/cadastrarDenuncia.php?tipo=animal&id=' + animal.id + '\'">Reportar</button>' +
                '</div>' +
            '</div>';

            modal.onclick = (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            };

            setTimeout(function() {
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
        } catch (e) {
            console.error(e);
        }
    };

    document.addEventListener("click", async (event) => {
        const target = event.target;

        const favBtn = target instanceof Element ? target.closest("#animais-modal .favoritar-btn") : null;
        if (favBtn) {
            const animalId = favBtn.dataset.animalId;
            if (animalId) {
                const estaFavoritado = favBtn.textContent.trim() === "Remover dos Favoritos";
                favBtn.textContent = estaFavoritado ? "Favoritar" : "Remover dos Favoritos";
                try {
                    await fetch("/backEnd/home.php?route=favoritar_animal&idAnimal=" + animalId);
                } catch (error) {
                    console.error("Erro ao favoritar:", error);
                }
            }
            return;
        }

        const matchBtn = target instanceof Element ? target.closest("#animais-modal .match-btn") : null;
        if (!matchBtn || matchBtn.disabled) return;

        const animalId = matchBtn.dataset.animalId;
        if (!confirm("Enviar solicitacao de match para este animal?")) return;

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
                matchStatusMap[animalId] = { status: "pendente" };
                matchBtn.textContent = "Pendente";
                matchBtn.disabled = true;
            } else {
                alert("Erro: " + (data.erro || "Erro desconhecido"));
            }
        } catch (error) {
            alert("Erro de conexao.");
        }
    });

    carregarMatchStatus();
    carregarDestaques();
});
