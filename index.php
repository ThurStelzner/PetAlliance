<?php
    require_once("conexao.php");
    session_start();
    $mensagem = "";

    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $cpf = $_POST['cpf'];
        $senha = $_POST['senha'];

        $sql = "SELECT * FROM tb_usuarios WHERE cpf = '$cpf' AND ds_senha = '$senha'";
        $resultado = $conectar->query($sql);

        if ($resultado->rowCount() > 0) {
            $usuario = $resultado->fetch();

            $_SESSION["usuario_id"] = $usuario["id"];
            $_SESSION["usuario_nome"] = $usuario["nome"];
            $mensagem = "Login realizado!";
            header("Location: home.php");
            exit;

        } else {
            $mensagem = "CPF ou senha incorretos";
        }
    }
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pet Alliance - Login</title>
</head>
<body>
    <?php if (!empty($mensagem)) { ?>
        <span class="mensagem" style="color:red;"><?php echo $mensagem; ?></span>
    <?php } ?>

    <div class="form-body">
        <form method="POST">

            <label for="cpf">CPF</label>
            <input type="text" minlength="11" maxlength="11" name="cpf" placeholder="CPF Sem pontos e traços" required>

            <label for="senha">Senha</label>
            <input type="password" name="senha" placeholder="Sua Senha" required>

            <button type="submit">Acessar</button>

        </form>
        <a href="cadastro.php">Ainda não tenho login</a>
    </div>
    
    <footer>Pet Alliance</footer>
</body>
</html>