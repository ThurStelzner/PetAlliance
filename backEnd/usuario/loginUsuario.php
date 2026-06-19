<?php
    require __DIR__ . "/../../frontEnd/view/login.html";
    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require __DIR__ . "/../../frontEnd/view/footer.html";

    $usuarioDAO = new UsuarioDAO();

    if($_SERVER['REQUEST_METHOD'] === "POST") {
        $cpf = trim($_POST['cpf']);
        $_SESSION['cpf_digitado'] = trim($_POST['cpf']);
        $senha = trim($_POST['senha']);
    
        $usuario = $usuarioDAO->read($cpf);

        if (!$usuario) {
            echo "CPF não cadastrado!";
        }elseif ($cpf !== $usuario->getCpf()) {
            echo "Cpf inválido!";
        } elseif ($senha !== $usuario->getSenha()) {
            echo "Senha inválida!";
        }else {
            header("Location: /index.php?sucesso=1");
            exit;
        }

    }

    


