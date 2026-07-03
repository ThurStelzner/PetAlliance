<?php
    require __DIR__ . "/../../frontEnd/view/login.html";
    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require __DIR__ . "/../../frontEnd/view/footer.html";

    session_start();

    $usuarioDAO = new UsuarioDAO();

    if($_SERVER['REQUEST_METHOD'] === "POST") {
        $cpf = preg_replace('/[^0-9]/', '', trim($_POST['cpf']));
        $_SESSION['cpf_digitado'] = $cpf;
        $senha = trim($_POST['senha']);
    
        $usuario = $usuarioDAO->read($cpf);

        if (!$usuario) {
            echo "CPF não cadastrado!";
        } elseif ($cpf !== $usuario->getCpf()) {
            echo "Cpf inválido!";
        } else {
            $senhaCorreta = password_verify($senha, $usuario->getSenha()) || ($senha === $usuario->getSenha());

            if (!$senhaCorreta) {
                echo "Senha inválida!";
            } else {
                $_SESSION['usuario_id'] = $usuario->getId();
                $_SESSION['usuario_nome'] = $usuario->getNome();
                $_SESSION['usuario_cpf'] = $usuario->getCpf();
                $_SESSION['usuario_email'] = $usuario->getEmail();
                $_SESSION['usuario_imagem'] = $usuario->getImagem();
                header("Location: /backEnd/home.php?sucesso=1");
                exit;
            }
        }

    }

    


