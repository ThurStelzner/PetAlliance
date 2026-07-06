document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "/backEnd/match.php?route=";

    async function carregarSolicitacoes() {
        try {
            const response = await fetch(API_BASE + "listar_solicitacoes", { credentials: "same-origin" });
            const data = await response.json();
            const container = document.getElementById("solicitacoes-list");
            if (!container) return;

            if (!data.sucesso || !data.solicitacoes.length) {
                container.innerHTML = "<p>Nenhuma solicitação de match.</p>";
                return;
            }

            let html = `<table class="solicitacoes-table">
                <thead><tr><th>Pet</th><th>Remetente</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>`;

            data.solicitacoes.forEach(s => {
                const foto = s.pet_foto || "placeholder.webp";
                const fotoRemetente = s.remetente_imagem || "placeholder.webp";
                html += `<tr>
                    <td><img src="/uploads/animais/${foto}" style="height:3rem;width:3rem;object-fit:cover;"> ${s.pet_nome}</td>
                    <td><img src="/uploads/usuario/${fotoRemetente}" style="height:3rem;width:3rem;object-fit:cover;"> ${s.remetente_nome}</td>
                    <td>${s.status === 'pendente' ? 'Pendente' : s.status === 'aceito' ? 'Aceito' : 'Recusado'}</td>
                    <td class="acoes-cell">
                        ${s.status === 'pendente'
                            ? `<button class="btn-aceitar" data-id="${s.id}">Aceitar</button>
                               <button class="btn-recusar" data-id="${s.id}">Recusar</button>`
                            : s.status === 'aceito'
                                ? `<a href="/backEnd/chat.php?solicitacao_id=${s.id}" class="btn-chat">Iniciar Chat</a>`
                                : '<span class="match-recusado">Recusado</span>'}
                    </td>
                </tr>`;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        } catch (error) {
            console.error("Erro ao carregar solicitações:", error);
        }
    }

    async function carregarNotificacoes() {
        try {
            const response = await fetch(API_BASE + "notificacoes", { credentials: "same-origin" });
            const data = await response.json();
            const container = document.getElementById("notificacoes-list");
            if (!container) return;

            if (!data.sucesso || !data.notificacoes.length) {
                container.innerHTML = "<p>Nenhuma notificação.</p>";
                return;
            }

            let html = "<ul class='notificacoes-list'>";
            data.notificacoes.forEach(n => {
                html += `<li class="${n.lida ? 'lida' : 'nao-lida'}">
                    <p>${n.mensagem}</p>
                    <small>${new Date(n.criado_em).toLocaleString('pt-BR')}</small>
                    ${!n.lida ? `<button class="btn-marcar-lida" data-id="${n.id}">Marcar como lida</button>` : ''}
                </li>`;
            });
            html += "</ul>";
            container.innerHTML = html;
        } catch (error) {
            console.error("Erro ao carregar notificações:", error);
        }
    }

    async function carregarMinhasSolicitacoes() {
        try {
            const response = await fetch(API_BASE + "minhas_solicitacoes", { credentials: "same-origin" });
            const data = await response.json();
            const container = document.getElementById("minhas-solicitacoes-list");
            if (!container) return;

            if (!data.sucesso || !data.solicitacoes.length) {
                container.innerHTML = "<p>Você ainda não enviou nenhuma solicitação.</p>";
                return;
            }

            let html = `<table class="solicitacoes-table">
                <thead><tr><th>Pet</th><th>Status</th><th>Ações</th><th>Data</th></tr></thead>
                <tbody>`;

            data.solicitacoes.forEach(s => {
                const foto = s.pet_foto || "placeholder.webp";
                html += `<tr>
                    <td><img src="/uploads/animais/${foto}" style="height:3rem;width:3rem;object-fit:cover;"> ${s.pet_nome}</td>
                    <td>${s.status === 'pendente' ? 'Pendente' : s.status === 'aceito' ? 'Aceito' : 'Recusado'}</td>
                    <td>${s.status === 'aceito' ? `<a href="/backEnd/chat.php?solicitacao_id=${s.id}" class="btn-chat">Iniciar Chat</a>` : '-'}</td>
                    <td>${new Date(s.criado_em).toLocaleString('pt-BR')}</td>
                </tr>`;
            });

            html += `</tbody></table>`;
            container.innerHTML = html;
        } catch (error) {
            console.error("Erro ao carregar minhas solicitações:", error);
        }
    }

    document.getElementById("solicitacoes-list")?.addEventListener("click", async e => {
        const botao = e.target.closest(".btn-aceitar, .btn-recusar");
        if (!botao) return;

        const id = parseInt(botao.dataset.id);
        const route = botao.classList.contains("btn-aceitar") ? "aceitar" : "recusar";

        try {
            const response = await fetch(API_BASE + route, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
                credentials: "same-origin"
            });
            const data = await response.json();
            if (data.sucesso) {
                alert(data.mensagem);
                carregarSolicitacoes();
                carregarNotificacoes();
            } else {
                alert("Erro: " + (data.erro || "Erro desconhecido"));
            }
        } catch (error) {
            alert("Erro de conexão.");
        }
    });

    document.getElementById("notificacoes-list")?.addEventListener("click", async e => {
        const botao = e.target.closest(".btn-marcar-lida");
        if (!botao) return;

        const id = parseInt(botao.dataset.id);
        try {
            await fetch(API_BASE + "marcarLida", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
                credentials: "same-origin"
            });
            carregarNotificacoes();
        } catch (error) {
            console.error("Erro ao marcar como lida:", error);
        }
    });

    carregarMinhasSolicitacoes();
    carregarSolicitacoes();
    carregarNotificacoes();
});
