document.addEventListener("DOMContentLoaded", () => {
    const API_URL_PERFIL = window.API_URL_PERFIL || "/public/api.php?controller=usuario&action=updateUsuarioFromRequest";
    const API_URL_READ = "/public/api.php?controller=usuario&action=read";
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
            const response = await fetch(API_URL_READ, { 
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

    function formatarCep(valor) {
        const somenteNumeros = String(valor || '').replace(/\D/g, '').slice(0, 8);
        if (somenteNumeros.length <= 5) return somenteNumeros;
        return `${somenteNumeros.slice(0, 5)}-${somenteNumeros.slice(5)}`;
    }

    function aplicarMascaraCampos() {
        const cepInput = form.querySelector('[name="cep"]');

        if (cepInput) {
            cepInput.addEventListener('input', () => {
                cepInput.value = formatarCep(cepInput.value);
            });
        }
    }

// ============================================
        // Preencher formulário com dados do usuário
        // ============================================
        function preencherFormulario(usuario) {
            const campos = {
                'nome': usuario.nome,
                'email': usuario.email,
                'cep': formatarCep(usuario.cep),
            };

            Object.keys(campos).forEach(campo => {
                const input = form.querySelector(`[name="${campo}"]`);
                if (input && campos[campo]) {
                    input.value = campos[campo];
                }
            });

            // Foto de perfil: mostrar preview dinâmico
            const fileInput = form.querySelector('[name="foto_perfil"]');
            const previewContainer = document.getElementById('profile-preview-container');

            if (previewContainer) {
                // Limpa o conteúdo do container
                previewContainer.innerHTML = '';

                // Cria o elemento de preview da imagem
                const preview = document.createElement('img');
                preview.id = 'foto-perfil-preview';
                preview.style.maxWidth = '200px';
                preview.style.height = '200px';
                preview.style.objectFit = 'cover';
                preview.style.borderRadius = '8px';
                preview.style.display = 'block';
                preview.style.marginBottom = '0.5rem';

                // mostra imagem atual se houver
                if (usuario.imagem) {
                    preview.src = `/uploads/usuario/${usuario.imagem}`;
                } else {
                    preview.src = '/uploads/usuario/placeholder.webp';
                }

                previewContainer.appendChild(preview);

                // Atualiza preview quando usuário selecionar novo arquivo
                if (fileInput) {
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
        }

    async function validarCep(cep) {
        const cepNumerico = String(cep || '').replace(/\D/g, '');

        if (cepNumerico.length !== 8) {
            throw new Error('CEP inválido. Informe um CEP com 8 dígitos.');
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
            const dados = await response.json();

            if (dados.erro) {
                throw new Error('CEP não encontrado.');
            }

            return true;
        } catch (error) {
            throw new Error('Não foi possível validar o CEP no momento.');
        }
    }

    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // ============================================
    // Enviar formulário de atualização
    // ============================================
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const cepInput = form.querySelector('[name="cep"]');
        const emailInput = form.querySelector('[name="email"]');

        try {
            await validarCep(cepInput?.value);
            
            if (emailInput && !validarEmail(emailInput.value)) {
                throw new Error('Por favor, insira um e-mail válido.');
            }
        } catch (error) {
            exibirErro(error.message);
            return;
        }

        const formData = new FormData(form);
        formData.append('route', 'usuario');

        // Garante que os campos sejam enviados com o formato esperado pelo backend.
        const cepValue = formData.get('cep');

        if (cepValue) formData.set('cep', cepValue);

        try {
            const response = await fetch(API_URL_PERFIL, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Accept': 'application/json'
                },
                body: formData
            });

            const resultado = await response.json();

            if (!response.ok || !resultado.success) {
                throw new Error(resultado.message || 'Não foi possível atualizar o perfil.');
            }

            window.location.href = '/backEnd/usuario/perfil.php?sucesso=1';
        } catch (error) {
            console.error("Erro ao atualizar perfil:", error);
            exibirErro(error.message);
        }
    });

    function limparMensagens() {
        form.parentNode.querySelectorAll('.alert').forEach((elemento) => elemento.remove());
    }

    // ============================================
    // Exibir mensagem de erro
    // ============================================
    function exibirErro(mensagem) {
        limparMensagens();

        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger';
        alertDiv.textContent = `Erro: ${mensagem}`;
        form.insertAdjacentElement('beforebegin', alertDiv);
    }

    aplicarMascaraCampos();

    // ============================================
    // Inicializar: Carregar dados ao abrir página
    // ============================================
    carregarEditarPerfil();
});