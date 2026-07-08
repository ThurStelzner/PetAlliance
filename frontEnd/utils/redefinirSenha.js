document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-senha');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const senha = document.getElementById('senha').value;
        const confirmar = document.getElementById('confirmar_senha').value;
        const erroDiv = document.getElementById('mensagem-erro');
        const sucessoDiv = document.getElementById('mensagem-sucesso');
        const btn = form.querySelector('button');

        erroDiv.style.display = 'none';
        sucessoDiv.style.display = 'none';

        if (senha.length < 3) {
            erroDiv.textContent = 'A senha deve ter pelo menos 3 caracteres.';
            erroDiv.style.display = 'block';
            return;
        }

        if (senha !== confirmar) {
            erroDiv.textContent = 'As senhas não conferem.';
            erroDiv.style.display = 'block';
            return;
        }

        btn.disabled = true;
        btn.textContent = 'Salvando...';

        fetch('/backEnd/usuario/redefinirSenha.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'senha=' + encodeURIComponent(senha) + '&confirmar_senha=' + encodeURIComponent(confirmar)
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                sucessoDiv.textContent = data.message;
                sucessoDiv.style.display = 'block';
                form.style.display = 'none';
                setTimeout(function() {
                    window.location.href = '/backEnd/home.php';
                }, 2000);
            } else {
                erroDiv.textContent = data.message;
                erroDiv.style.display = 'block';
            }
        })
        .catch(function() {
            erroDiv.textContent = 'Erro ao conectar com o servidor.';
            erroDiv.style.display = 'block';
        })
        .finally(function() {
            btn.disabled = false;
            btn.textContent = 'Salvar nova senha';
        });
    });
});
