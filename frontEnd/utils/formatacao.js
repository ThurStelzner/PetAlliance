document.addEventListener("DOMContentLoaded", function () {
    const cpfInput = document.getElementById("cpf");

    if (cpfInput) {
        cpfInput.addEventListener("input", function () {
            this.value = mascaraCPF(this.value);
    });
  }
});

function mascaraCPF(valor) {
    return valor
        .replace(/\D/g, "")
        .substring(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

async function validarCep() {
    const cep = document.querySelector("#cep").value;

    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d = await r.json();
    console.log(d);

    if(d.erro) {
        alert('CEP não encontrado!');
        return;
    }
}

function avancar() {
    document.getElementById('etapa1').style.display = 'none';
    document.getElementById('etapa2').style.display = 'block';
    localStorage.setItem('etapa', 'etapa2');
}

function voltar() {
    document.getElementById('etapa2').style.display = 'none';
    document.getElementById('etapa1').style.display = 'block';
    localStorage.setItem('etapa', 'etapa1');
}

function limparFoto() {
    document.getElementById('imagem').value = '';
}

document.getElementById('cep').addEventListener('blur', validarCep);
