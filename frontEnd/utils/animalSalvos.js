const formulario = document.querySelector("form");

const certificado = document.getElementById("certificado");
const vacinado = document.getElementById("vacinado");
const campoCertificado = document.getElementById("campoCertificado");
const campoVacinacao = document.getElementById("campoVacinacao");

if (window.flashMessage && window.flashMessage.sucesso) {
    [
        "animalNome",
        "animalRaca",
        "animalCor",
        "animalSexo",
        "animalTipo",
        "animalPorte",
        "animalNascimento",
        "animalPeso",
        "animalDescricao"
    ].forEach(chave => sessionStorage.removeItem(chave));
}

if (formulario) {
    formulario.addEventListener("submit", () => {
        const nome = document.getElementById("nome");
        const raca = document.getElementById("raca");
        const cor = document.getElementById("cor");
        const sexo = document.getElementById("sexo");
        const tipo = document.getElementById("tipo");
        const porte = document.getElementById("porte");
        const dtNascimento = document.getElementById("dt_nascimento");
        const peso = document.getElementById("peso");
        const descricao = document.getElementById("descricao");

        if (nome) sessionStorage.setItem("animalNome", nome.value);
        if (raca) sessionStorage.setItem("animalRaca", raca.value);
        if (cor) sessionStorage.setItem("animalCor", cor.value);
        if (sexo) sessionStorage.setItem("animalSexo", sexo.value);
        if (tipo) sessionStorage.setItem("animalTipo", tipo.value);
        if (porte) sessionStorage.setItem("animalPorte", porte.value);
        if (dtNascimento) sessionStorage.setItem("animalNascimento", dtNascimento.value);
        if (peso) sessionStorage.setItem("animalPeso", peso.value);
        if (descricao) sessionStorage.setItem("animalDescricao", descricao.value);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    const nome = document.getElementById("nome");
    const raca = document.getElementById("raca");
    const cor = document.getElementById("cor");
    const sexo = document.getElementById("sexo");
    const tipo = document.getElementById("tipo");
    const porte = document.getElementById("porte");
    const dtNascimento = document.getElementById("dt_nascimento");
    const peso = document.getElementById("peso");
    const descricao = document.getElementById("descricao");

    if (nome) nome.value = sessionStorage.getItem("animalNome") || "";
    if (raca) raca.value = sessionStorage.getItem("animalRaca") || "";
    if (cor) cor.value = sessionStorage.getItem("animalCor") || "";
    if (sexo) sexo.value = sessionStorage.getItem("animalSexo") || "";
    if (tipo) tipo.value = sessionStorage.getItem("animalTipo") || "";
    if (porte) porte.value = sessionStorage.getItem("animalPorte") || "";
    if (dtNascimento) dtNascimento.value = sessionStorage.getItem("animalNascimento") || "";
    if (peso) peso.value = sessionStorage.getItem("animalPeso") || "";
    if (descricao) descricao.value = sessionStorage.getItem("animalDescricao") || "";
});


