document.addEventListener("DOMContentLoaded", () => {
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
});
