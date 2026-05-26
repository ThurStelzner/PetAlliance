<?php
    include "./funcoes/config.php";
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login - PetAlliance</title>
</head>
<body>
    <form action="config.php" method="POST">
        <label for="nome">CPF:</label>
        <input type="text" id="cpf" name="cpf" placeholder="Seu nome de login aqui" required>
        <label for="nome">Senha:</label>
        <input type="text" id="nome" name="nome" placeholder="Seu nome de login aqui" required>
        <button type="submit">Login</button>
    </form>
</body>
</html>