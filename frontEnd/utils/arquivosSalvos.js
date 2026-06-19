const formulario = document.querySelector("form");

const certificado = document.getElementById("certificado");
const vacinado = document.getElementById("vacinado");

const campoCertificado = document.getElementById("campoCertificado");
const campoVacinacao = document.getElementById("campoVacinacao");

    formulario.addEventListener("submit", () => {
        sessionStorage.setItem("animalNome", document.getElementById("nomeAnimal").value);
        sessionStorage.setItem("animalRaca", document.getElementById("raca").value);
        sessionStorage.setItem("animalCor", document.getElementById("cor").value);
        sessionStorage.setItem("animalSexo", document.getElementById("sexo").value);
        sessionStorage.setItem("animalTipo", document.getElementById("tipo").value);
        sessionStorage.setItem("animalPorte", document.getElementById("porte").value);
        sessionStorage.setItem("animalNascimento", document.getElementById("dt_nascimento").value);
        sessionStorage.setItem("animalPeso", document.getElementById("peso").value);
        sessionStorage.setItem("animalDescricao", document.getElementById("descricao").value);
        sessionStorage.setItem("nomeDigitado", document.getElementById("nomeUsuario").value);
        sessionStorage.setItem("cpfDigitado", document.getElementById("cpf").value);
        sessionStorage.setItem("cepDigitado", document.getElementById("cep").value);
        sessionStorage.setItem("emailDigitado", document.getElementById("email").value);
    });

    window.addEventListener("DOMContentLoaded", () => {
        document.getElementById("nomeAnimal").value = sessionStorage.getItem("animalNome") || "";
        document.getElementById("raca").value = sessionStorage.getItem("animalRaca") || "";
        document.getElementById("cor").value = sessionStorage.getItem("animalCor") || "";
        document.getElementById("sexo").value = sessionStorage.getItem("animalSexo") || "";
        document.getElementById("tipo").value = sessionStorage.getItem("animalTipo") || "";
        document.getElementById("porte").value = sessionStorage.getItem("animalPorte") || "";
        document.getElementById("dt_nascimento").value = sessionStorage.getItem("animalNascimento") || "";
        document.getElementById("peso").value = sessionStorage.getItem("animalPeso") || "";
        document.getElementById("descricao").value = sessionStorage.getItem("animalDescricao") || "";
        document.getElementById("nomeUsuario").value = sessionStorage.getItem("nomeDigitado") || "";
        document.getElementById("cpf").value = sessionStorage.getItem("cpfDigitado" || "");
        document.getElementById("cep").value = sessionStorage.getItem("cepDigitado")|| "" ;
        document.getElementById("email").value = sessionStorage.getItem("emailDigitado") || "";

    });

    certificado.addEventListener("change", function () {
        campoCertificado.style.display =
            this.value === "1" ? "block" : "none";
    });

    vacinado.addEventListener("change", function () {
        campoVacinacao.style.display =
            this.value === "1" ? "block" : "none";
    });