<?php

    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require_once __DIR__ . "/../../backEnd/models/usuario.php";
    require_once __DIR__ . "/../../backEnd/models/verificacaoDAO.php";
    require_once __DIR__ . "/../../backEnd/models/EmailService.php";
    require_once __DIR__ . "/../../backEnd/config/validacao.php";
    require_once __DIR__ . "/../controllers/api/usuarioController.php";


    session_start();

    require __DIR__ . "/../../frontEnd/view/cadastrarUsuario.html";
    
    if($_SERVER['REQUEST_METHOD'] === "POST") {
        try {
            $nome = trim($_POST['nome'] ?? "");
            $cpf = trim($_POST['cpf'] ?? "");
            $cep = trim($_POST['cep'] ?? "");
            $email = trim($_POST['email'] ?? "");
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                throw new InvalidArgumentException("Email inválido.");
            }
            $senha = trim($_POST['senha'] ?? "");
            $tipo = 0;

            $cepNumerico = preg_replace('/[^0-9]/', '', $cep);
            if (strlen($cepNumerico) !== 8) {
                throw new InvalidArgumentException("CEP inválido. Informe um CEP com 8 dígitos.");
            }

            $validacaoSenha = validarSenhaForte($senha);
            if ($validacaoSenha !== true) {
                throw new InvalidArgumentException($validacaoSenha);
            }
            
            $nomeArquivo = "placeholder.webp";

            $controller = new UsuarioController();

            if(isset($_POST['cadastrarFoto'])) {
                if(!isset($_FILES['imagemPerfil']) || $_FILES['imagemPerfil']['error'] === UPLOAD_ERR_NO_FILE) {
                    echo "Selecione uma imagem";
                    exit();
                }
                if ($_FILES['imagemPerfil']['size'] > MAX_FILE_SIZE) {
                    echo "Arquivo muito grande. Tamanho máximo permitido: 100MB.";
                    exit();
                }
                $extensao  = pathinfo($_FILES['imagemPerfil']['name'], PATHINFO_EXTENSION);
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];
                if (!in_array(strtolower($extensao), $permitidos) || !validarMimeImagem($_FILES['imagemPerfil']['tmp_name'])) {
                    echo 'Tipo de imagem não permitido.';
                    exit();
                } else {
                    $nomeArquivo = uniqid('prod_') . '.' . $extensao;
                    move_uploaded_file($_FILES['imagemPerfil']['tmp_name'], '../../uploads/usuario/' . $nomeArquivo);
                    $usuarioCadastrado = $controller->criarUsuario(new Usuario($nomeArquivo, $cpf, $cep,$tipo, $nome, $email, $senha));

                    $usuarioId = $usuarioCadastrado->getId();
                }
            }

            if (!isset($usuarioCadastrado)) {
                $usuarioCadastrado = $controller->criarUsuario(new Usuario($nomeArquivo, $cpf, $cep, $tipo, $nome, $email, $senha));
                $usuarioId = $usuarioCadastrado->getId();
            }

            // Admin (tipo 1) já verificado e logado
            if ($tipo == 1) {
                $dao = new UsuarioDAO();
                $dao->marcarVerificado($usuarioId);
                session_regenerate_id(true);
                $_SESSION['usuario_id'] = $usuarioId;
                $_SESSION['usuario_nome'] = $usuarioCadastrado->getNome();
                $_SESSION['usuario_email'] = $usuarioCadastrado->getEmail();
                $_SESSION['usuario_imagem'] = $usuarioCadastrado->getImagem();
                $_SESSION['usuario_cpf'] = $usuarioCadastrado->getCpf();
                $_SESSION['usuario_tipo'] = $tipo;
                header("Location: /backEnd/home.php");
                exit();
            }

            // Usuário normal: envia verificação e redireciona
            $controller->enviarEmailVerificacao($usuarioId);
            $_SESSION['usuario_verificacao_id'] = $usuarioId;
            header("Location: /backEnd/verificarEmail.php?id=$usuarioId");
            exit();
        } catch (InvalidArgumentException $e) {
            echo htmlspecialchars($e->getMessage());
        } catch (PDOException $e) {
            error_log("Erro ao cadastrar usuário: " . $e->getMessage());
            echo "<p id='mensagem' class='mensagem-escondida'>Erro ao cadastrar. Tente novamente.</p>";
        }
    }
    require __DIR__ . "/../../frontEnd/view/footer.html";
