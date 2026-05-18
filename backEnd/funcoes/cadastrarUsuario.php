<?php

    include_once 'config.php';
    $conn = conectarBanco();
    $mensagem = "";

    $nome = $_POST['nome'] ?? '';
    $cpf = $_POST['cpf'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';
    $tipo = 0;

    try {
        $sql = "INSERT INTO tb_usuarios (`cpf`, `tp_usuario`, `nm_usuario`, `ds_email`, `ds_senha`) VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$cpf, $tipo, $nome, $email, $senha]);

        header("Location: ../");
        exit();
    } catch(Exception $e) {
        $mensagem = "<span class='erro'>Erro: " . $e->getMessage() . "</span>";
    }
?>