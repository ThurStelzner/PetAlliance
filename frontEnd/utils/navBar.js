document.addEventListener("DOMContentLoaded", async () => {
    if (window.EH_ADMIN) {
        const menuList = document.querySelector("#menu ul");
        if (menuList) {
            const liDenuncias = document.createElement("li");
            const aDenuncias = document.createElement("a");
            aDenuncias.href = "/backEnd/admin/admin.php#denuncias";
            aDenuncias.textContent = "Ver Denúncias";
            liDenuncias.appendChild(aDenuncias);
            menuList.appendChild(liDenuncias);

            const liStats = document.createElement("li");
            const aStats = document.createElement("a");
            aStats.href = "/backEnd/admin/admin.php#sistema";
            aStats.textContent = "Estatísticas";
            liStats.appendChild(aStats);
            menuList.appendChild(liStats);
        }
    }

    try {
        const response = await fetch("/backEnd/match.php?route=naoLidas", { credentials: "same-origin" });
        const data = await response.json();
        const link = document.querySelector('a[href="/backEnd/match.php"]');
        if (link && data.naoLidas > 0) {
            const badge = document.createElement("span");
            badge.className = "badge-notificacoes";
            badge.textContent = data.naoLidas;
            link.appendChild(badge);
        }
    } catch (error) {
        console.error("Erro ao carregar badge:", error);
    }
});
