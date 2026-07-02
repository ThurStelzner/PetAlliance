document.addEventListener("DOMContentLoaded", () => {
    const API_URL_PERFIL = window.API_URL_PERFIL || "/backEnd/usuario/editarPerfil.php";
    const form = document.getElementById("editar-perfil-form");

    if (!form) {
        console.error("Formulário #editar-perfil-form não encontrado.");
        return;
    }

    // ============================================
    // Carregar dados do usuário no formulário
    // ============================================
    async function carregarEditarPerfil() {
        try {
            const response = await fetch(API_URL_PERFIL, { 
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Erro ao buscar perfil: ${response.status}`);
            }

            const usuario = await response.json();

            if (!usuario || usuario.erro) {
                throw new Error(usuario?.erro || "Usuário não encontrado.");
            }

            preencherFormulario(usuario);
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            exibirErro(error.message);
        }
    }

    // ============================================
    // Preencher formulário com dados do usuário
    // ============================================
    function preencherFormulario(usuario) {
        const campos = {
            'nome': usuario.nome,
            'email': usuario.email,
            'cpf': usuario.cpf,
            'cep': usuario.cep,
        };

        Object.keys(campos).forEach(campo => {
            const input = form.querySelector(`[name="${campo}"]`);
            if (input && campos[campo]) {
                input.value = campos[campo];
            }
        });

        // Foto de perfil: mostrar preview dinâmico
        const fileInput = form.querySelector('[name="foto_perfil"]');
        const previewId = 'foto-perfil-preview';
        let preview = form.querySelector('#' + previewId);

        if (!preview) {
            preview = document.createElement('img');
            preview.id = previewId;
            preview.style.maxWidth = '200px';
            preview.style.height = '200px';
            preview.style.objectFit = 'cover';
            preview.style.borderRadius = '8px';
            preview.style.display = 'block';
            preview.style.marginBottom = '0.5rem';
        }

        // Insere o preview antes do input de arquivo, se existir
        if (fileInput) {
            fileInput.parentNode.insertBefore(preview, fileInput);

            // mostra imagem atual se houver
            if (usuario.imagem) {
                preview.src = `/uploads/usuario/${usuario.imagem}`;
            } else {
                preview.src = '/uploads/usuario/placeholder.webp';
            }

            // Atualiza preview quando usuário selecionar novo arquivo
            fileInput.addEventListener('change', () => {
                const file = fileInput.files && fileInput.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (e) => {
                    preview.src = e.target.result;
                };
                reader.readAsDataURL(file);
            });
        }
    }

    // ============================================
    // Exibir mensagem de erro
    // ============================================
    function exibirErro(mensagem) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.textContent = `Erro: ${mensagem}`;
        form.insertAdjacentElement('beforebegin', alertDiv);
    }

    // ============================================
    // Inicializar: Carregar dados ao abrir página
    // ============================================
    carregarEditarPerfil();
});