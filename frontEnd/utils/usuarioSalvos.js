const params = new URLSearchParams(window.location.search);

const formulario = document.querySelector("form");


if (params.get("sucesso") === "1") {
    [
        "nomeDigitado",
        "cpfDigitado",
        "cepDigitado",
        "emailDigitado",
        "imagemEscolhida",
    ].forEach(chave => sessionStorage.removeItem(chave));
}


formulario.addEventListener("submit", () => {
    sessionStorage.setItem("nomeDigitado", document.getElementById("nome").value);
    sessionStorage.setItem("cpfDigitado", document.getElementById("cpf").value);
    sessionStorage.setItem("cepDigitado", document.getElementById("cep").value);
    sessionStorage.setItem("emailDigitado", document.getElementById("email").value);
    sessionStorage.setItem("imagemEscolhida", document.getElementById("imagemPerfil").value);
});

window.addEventListener("DOMContentLoaded", () => {
    const nomeSalvo = sessionStorage.getItem("nomeDigitado");
    const cpfSalvo = sessionStorage.getItem("cpfDigitado");
    const cepSalvo = sessionStorage.getItem("cepDigitado");
    const emailSalvo = sessionStorage.getItem("emailDigitado");
    const imagemSalva = sessionStorage.getItem("imagemEscolhida");



    if (cpfSalvo,emailSalvo,cepSalvo,nomeSalvo) {
        document.getElementById("nome").value = nomeSalvo;
        document.getElementById("cpf").value = cpfSalvo;
        document.getElementById("cep").value = cepSalvo;
        document.getElementById("email").value = emailSalvo
        document.getElementById("imagemPerfil").value = imagemSalva;

    }
});



