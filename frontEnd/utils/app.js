document.addEventListener("DOMContentLoaded", () => {
    const API_URL_ANIMAIS = "/backEnd/home.php?route=animais";
    const container = document.getElementById("animais-container");

    if (!container) {
        console.error("Elemento #animais-container não encontrado.");
        return;
    }

    async function carregarAnimais() {
        try {
            const response = await fetch(API_URL_ANIMAIS);
            if (!response.ok) {
                throw new Error(`Erro ao buscar lista de animais: ${response.status}`);
            }

            const data = await response.json();

            if (data.erro) {
                throw new Error(data.erro);
            }

            const animais = Array.isArray(data) ? data : data.animais || [];

            container.innerHTML = "";

            animais.forEach(animal => {
                const card = document.createElement("article");
                card.classList.add("animal-card");
                card.innerHTML = `
                    <h3>${animal.nome || "Sem nome"}</h3>
                    <p>${animal.descricao || "Não informada"}</p>
                    <p>${animal.tipo || "Não informado"}</p>
                    <p>${animal.porte || "Não informado"}</p>
                    <p>${animal.sexo || "Não informado"}</p>
                `;
                container.appendChild(card);
            });
        } catch (error) {
            console.error("Erro ao carregar animais:", error);
            container.innerHTML = "<p>Não foi possível carregar os animais.</p>";
        }
    }

    carregarAnimais();
});