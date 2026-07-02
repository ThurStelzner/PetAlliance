document.addEventListener("DOMContentLoaded", () => {
    const donoId = window.donoId;
    const API_URL_MEUS_ANIMAIS = `/backEnd/animal/meusAnimais.php?donoid=${donoId}`;
    const container = document.getElementById("animais-container");

    if (!container) {
        console.error("Elemento #animais-container não encontrado.");
        return;
    }

    if (!donoId) {
        container.innerHTML = "<p>ID do dono não fornecido.</p>";
        return;
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

            animais.forEach(animal => {
                const card = document.createElement("article");
                card.classList.add("animal-card");
                card.innerHTML = `
                    <h3>${animal.nome || "Sem nome"}</h3>
                    <p><strong>Raça:</strong> ${animal.raca || "Não informada"}</p>
                    <p><strong>Tipo:</strong> ${animal.tipo || "Não informado"}</p>
                    <p><strong>Porte:</strong> ${animal.porte || "Não informado"}</p>
                    <p><strong>Sexo:</strong> ${animal.sexo || "Não informado"}</p>
                    <p><strong>Cor:</strong> ${animal.cor || "Não informada"}</p>
                    <p><strong>Descrição:</strong> ${animal.descricao || "Não informada"}</p>
                `;
                container.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar seus animais:", error);
            container.innerHTML = "<p>Não foi possível carregar seus animais.</p>";
        }
    }

    carregarMeusAnimais();
});
