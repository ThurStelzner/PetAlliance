function mostrarSecao(hash) {
    document.getElementById("denuncias-section").style.display = hash === "#sistema" ? "none" : "";
    document.getElementById("sistema-section").style.display = hash === "#sistema" ? "" : "none";
}

document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "/backEnd/admin/admin.php?route=";

    mostrarSecao(window.location.hash || "#denuncias");

    window.addEventListener("hashchange", () => mostrarSecao(window.location.hash));

    async function carregarSistema() {
        try {
            const response = await fetch(API_BASE + "sistema", { credentials: "same-origin" });
            const data = await response.json();

            const container = document.getElementById("sistema-cards");
            if (!container) return;

            if (!data.sucesso) {
                container.innerHTML = `<p>Erro: ${data.erro}</p>`;
                return;
            }

            const s = data.sistema;
            container.innerHTML = `
                <div class="stat-card"><strong>Usuários Cadastrados</strong><span>${s.totalUsuarios}</span></div>
                <div class="stat-card"><strong>Animais Cadastrados</strong><span>${s.totalAnimais}</span></div>
                <div class="stat-card"><strong>Denúncias</strong><span>${s.totalDenuncias}</span></div>
            `;
        } catch (error) {
            console.error("Erro ao carregar estatísticas do sistema:", error);
        }
    }

    async function resolverDenuncia(id, botao, novoStatus) {
        try {
            const response = await fetch(API_BASE + "resolver", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, resolvido: novoStatus }),
                credentials: "same-origin"
            });
            const data = await response.json();
            if (data.sucesso) {
                const row = botao.closest("tr");
                const statusCell = row.querySelector(".status-cell");
                const acoesCell = row.querySelector(".acoes-cell");
                if (novoStatus === 1) {
                    statusCell.textContent = "Resolvido";
                    acoesCell.innerHTML = `<button class="btn-voltar" data-id="${id}">Voltar</button>`;
                } else {
                    statusCell.textContent = "Pendente";
                    acoesCell.innerHTML = `<button class="btn-concluir" data-id="${id}">Concluir</button>`;
                }
            } else {
                alert("Erro: " + (data.erro || "não foi possível concluir"));
            }
        } catch (error) {
            alert("Erro de conexão ao resolver denúncia.");
        }
    }

    function montarTabelaDenuncias(titulo, denuncias) {
        if (!denuncias.length) return "";
        const resolvidoLabels = { 0: "Pendente", 1: "Resolvido" };

        let html = `<h4>${titulo} (${denuncias.length})</h4>
            <table class="denuncias-table">
                <thead><tr><th>ID</th><th>Usuário</th><th>Alvo ID</th><th>Descrição</th><th>Status</th><th>Ações</th></tr></thead>
                <tbody>
        `;

        denuncias.forEach(d => {
            const pendente = d.resolvido == 0;
            html += `<tr>
                <td>${d.id}</td>
                <td>${d.usuario_nome || "Desconhecido"}</td>
                <td>${d.alvo_id || "-"}</td>
                <td>${d.descricao || "-"}</td>
                <td class="status-cell">${resolvidoLabels[d.resolvido] || "Desconhecido"}</td>
                <td class="acoes-cell">${pendente
                    ? `<button class="btn-concluir" data-id="${d.id}">Concluir</button>`
                    : `<button class="btn-voltar" data-id="${d.id}">Voltar</button>`}</td>
            </tr>`;
        });

        html += `</tbody></table>`;
        return html;
    }

    document.getElementById("denuncias-list").addEventListener("click", e => {
        const botao = e.target.closest(".btn-concluir, .btn-voltar");
        if (botao) {
            const id = parseInt(botao.dataset.id);
            const novoStatus = botao.classList.contains("btn-concluir") ? 1 : 0;
            resolverDenuncia(id, botao, novoStatus);
        }
    });

    async function carregarDenuncias() {
        try {
            const response = await fetch(API_BASE + "listar", { credentials: "same-origin" });
            const data = await response.json();

            const container = document.getElementById("denuncias-list");
            if (!container) return;

            if (!data.sucesso || !data.denuncias || !data.denuncias.length) {
                container.innerHTML = "<p>Nenhuma denúncia encontrada.</p>";
                return;
            }

            const site = data.denuncias.filter(d => d.tipo_alvo === "site");
            const usuario = data.denuncias.filter(d => d.tipo_alvo === "usuario");
            const animal = data.denuncias.filter(d => d.tipo_alvo === "animal");

            container.innerHTML =
                montarTabelaDenuncias("Denúncias de Site", site) +
                montarTabelaDenuncias("Denúncias de Usuário", usuario) +
                montarTabelaDenuncias("Denúncias de Animal", animal);
        } catch (error) {
            console.error("Erro ao carregar denúncias:", error);
        }
    }

    carregarSistema();
    carregarDenuncias();
});
