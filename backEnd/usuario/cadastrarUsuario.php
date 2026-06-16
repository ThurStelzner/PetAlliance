<?php

    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require_once __DIR__ . "/../../backEnd/models/usuario.php";

    if($_SERVER['REQUEST_METHOD'] === "POST") {
        try {
            $nome = trim($_POST['nome'] ?? "");
            $cpf = trim($_POST['cpf'] ?? "");
            $cep = trim($_POST['cep'] ?? "");
            $email = trim($_POST['email'] ?? "");
            $senha = trim($_POST['senha'] ?? "");

            $dao = new UsuarioDAO();
            $dao->cadastrarUsuario(new Usuario($cpf, $cep, $nome, $email, $senha));

            header("Location: /index.php");
            exit();
        } catch (InvalidArgumentException $e) {
            echo "Erro: " . $e->getMessage();
        } catch (PDOException $e) {
            echo "Erro: " . $e->getMessage();
        }
    }

    require __DIR__ . "/../../frontEnd/view/cadastrarUsuario.html";
    require __DIR__ . "/../../frontEnd/view/footer.html";
