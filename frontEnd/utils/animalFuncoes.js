vacinado.addEventListener("change", () => {
    if (vacinado.value === "1") {
        campoVacinacao.style.display = "block";
        arquivoVacinacao.required = true;
    } else {
        campoVacinacao.style.display = "none";
        arquivoVacinacao.required = false;
        arquivoVacinacao.value = "";
    }
});

certificado.addEventListener("change", () => {
    if (certificado.value === "1") {
        campoCertificado.style.display = "block";
        arquivoCertificado.required = true;
    } else {
        campoCertificado.style.display = "none";
        arquivoCertificado.required = false;
        arquivoCertificado.value = "";
    }
});