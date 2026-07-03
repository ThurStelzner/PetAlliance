<?php

    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require_once __DIR__ . "/../../backEnd/models/usuario.php";

    session_start();

    require __DIR__ . "/../../frontEnd/view/cadastrarUsuario.html";
    require __DIR__ . "/../../frontEnd/view/footer.html";

    if($_SERVER['REQUEST_METHOD'] === "POST") {
        try {
            $nome = trim($_POST['nome'] ?? "");
            $cpf = trim($_POST['cpf'] ?? "");
            $cep = trim($_POST['cep'] ?? "");
            $email = trim($_POST['email'] ?? "");
            $senha = trim($_POST['senha'] ?? "");
            $tipo = 0;

            $cepNumerico = preg_replace('/[^0-9]/', '', $cep);
            if (strlen($cepNumerico) !== 8) {
                throw new InvalidArgumentException("CEP inválido. Informe um CEP com 8 dígitos.");
            }
            
            $nomeArquivo = "placeholder.webp";

            if(isset($_POST['cadastrarFoto'])) {
                if(!isset($_FILES['imagemPerfil']) || $_FILES['imagemPerfil']['error'] === UPLOAD_ERR_NO_FILE) {
                    echo "Selecione uma imagem";
                    exit();
                }
                $extensao  = pathinfo($_FILES['imagemPerfil']['name'], PATHINFO_EXTENSION);
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];
                if (!in_array(strtolower($extensao), $permitidos)) {
                    echo 'Tipo de imagem não permitido.';
                    exit();
                } else {
                    $dao = new UsuarioDAO();
                    $nomeArquivo = uniqid('prod_') . '.' . $extensao;
                    move_uploaded_file($_FILES['imagemPerfil']['tmp_name'], '../../uploads/usuario/' . $nomeArquivo);
                    $usuarioCadastrado = $dao->cadastrarUsuario(new Usuario($nomeArquivo, $cpf, $cep,$tipo, $nome, $email, $senha));

                    $_SESSION['usuario_id'] = $usuarioCadastrado->getId();
                    $_SESSION['usuario_nome'] = $usuarioCadastrado->getNome();
                    $_SESSION['usuario_email'] = $usuarioCadastrado->getEmail();
                    $_SESSION['usuario_imagem'] = $usuarioCadastrado->getImagem();
                    $_SESSION['usuario_cpf'] = $usuarioCadastrado->getCpf();

                    header("Location: /backEnd/home.php");
                    exit();
                }
            }

            $dao = new UsuarioDAO();
            $usuarioCadastrado = $dao->cadastrarUsuario(new Usuario($nomeArquivo, $cpf, $cep,$tipo, $nome, $email, $senha));

            $_SESSION['usuario_id'] = $usuarioCadastrado->getId();
            $_SESSION['usuario_nome'] = $usuarioCadastrado->getNome();
            $_SESSION['usuario_email'] = $usuarioCadastrado->getEmail();
            $_SESSION['usuario_imagem'] = $usuarioCadastrado->getImagem();
            $_SESSION['usuario_cpf'] = $usuarioCadastrado->getCpf();

            header("Location: /backEnd/home.php");
            exit();
        } catch (InvalidArgumentException $e) {
            echo $e->getMessage();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
