<?php

    require __DIR__ . "/../../frontEnd/view/cadastrarUsuario.html";
    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require_once __DIR__ . "/../../backEnd/models/usuario.php";
    require __DIR__ . "/../../frontEnd/view/footer.html";
    
    if($_SERVER['REQUEST_METHOD'] === "POST") {
        try{
            $nome = trim($_POST['nome']) ?? "";
            $cpf = trim($_POST['cpf']) ?? "";
            $email = trim($_POST['email']) ?? "";
            $senha = trim($_POST['senha']) ?? "";
            $dao = new PessoaDAO;

            $dao->cadastrarUsuario(new Usuario($cpf, $nome, $email, $senha));
            header("Location:");
            exit();
            if($resultado == "cpfDuplicado") {
                echo "CPF Já cadastrado!";
            };
        } catch (PDOExeption $e) {
            echo "Erro: " . $e->getMessage();
        }



    }