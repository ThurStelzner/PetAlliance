<?php
    require_once "./funcoes/config.php";
    include_once "./funcoes/funcoesUsuario.php";

    if($_SERVER['REQUEST_METHOD'] === "POST") {
        $cpf = $_POST['cpf'];
        $nome = $_POST['nome'];
        $email = $_POST['email'];
        $senha = $_POST['senha'];
        $Fcpf = FormatarCpf($cpf);

        if($Fcpf === 'erro') {
            echo "CPF inválido";
        } else {
            CadastrarUsuario($cpf, $nome, $email, $senha, $pdo);
        }
    }
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro - PetAlliance</title>
</head>
<body>
    <form method="POST">
        <label for="nome">Nome completo:</label>
        <input type="text" id="nome" name="nome" placeholder="Seu nome aqui" required>
        <label for="cpf">CPF:</label>
        <input type="text" id="cpf" name="cpf" minlength="11" maxlength="14" placeholder="Seu cpf aqui" required>
        <label for="email">Email para contato:</label>
        <input type="text" id="email" name="email" placeholder="Seu email aqui" required>
        <label for="senha">Senha:</label>
        <input type="text" id="senha" name="senha" placeholder="Seu nome aqui" required>
        <button type="submit">Cadastrar</button>
    </form>
</body>
</html>