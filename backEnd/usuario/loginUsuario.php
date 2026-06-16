<?php
    require __DIR__ . "/../../frontEnd/view/login.html";
    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require __DIR__ . "/../../frontEnd/view/footer.html";

    if($_SERVER['REQUEST_METHOD'] === "POST") {
        $cpf = trim($_POST['cpf']);
        $senha = trim($_POST['senha']);
        
        $usuarioDAO = new UsuarioDAO();

    $usuario = $usuarioDAO->read($cpf);

    if ($cpf === $usuario->getCpf() && $senha === $usuario->getSenha()) {
        echo "Login bem-sucedido!";
    }
    }

    


