const params = new URLSearchParams(window.location.search);

const formulario = document.querySelector("form");

    
if (params.get("sucesso") === "1") {
    [
        "cpfDigitado",
    ].forEach(chave => sessionStorage.removeItem(chave));
}


formulario.addEventListener("submit", () => {
    sessionStorage.setItem("cpfDigitado", document.getElementById("cpf").value);
});

window.addEventListener("DOMContentLoaded", () => {
    const cpfSalvo = sessionStorage.getItem("cpfDigitado");

    if (cpfSalvo) {
        document.getElementById("cpf").value = cpfSalvo;
    }
});

    
