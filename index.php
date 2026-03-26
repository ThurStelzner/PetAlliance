<?php
    require_once("conexao.php");
    session_start();
    $mensagem = "";

    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $cpf = $_POST['cpf'];
        $senha = $_POST['senha'];

        // 1. Busca o usuário APENAS pelo CPF usando Prepared Statements (Evita SQL Injection)
        $stmt = $conectar->prepare("SELECT * FROM tb_usuarios WHERE cpf = :cpf");
        $stmt->bindParam(':cpf', $cpf);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

            // 2. Verifica se o usuário JÁ ESTÁ bloqueado
            if ($usuario['fl_bloqueado'] == 1) {
                $mensagem = "Conta bloqueada por excesso de tentativas. Recupere sua senha ou contate o suporte.";
            } else {
                
                // 3. Verifica se a senha está correta
                // NOTA: Em produção, NUNCA compare senhas assim. Use password_verify() e hashes.
                if ($usuario['ds_senha'] === $senha) {
    
                    // SUCESSO! 
                    // 4. Zera as tentativas de login
                    $reset = $conectar->prepare("UPDATE tb_usuarios SET qt_tentativas_login = 0 WHERE cpf = :cpf");
                    $reset->bindParam(':cpf', $cpf);
                    $reset->execute();

                    // Cria as sessões (Usando o CPF como ID primário, conforme seu banco)
                    $_SESSION["usuario_cpf"] = $usuario["cpf"]; 

                    header("Location: home.php");
                    exit;

                } else {
                    // SENHA INCORRETA!
                    // 5. Calcula as novas tentativas   
                    $tentativas_atuais = $usuario['qt_tentativas_login'] + 1;
                    $limite_tentativas = 5;

                    if ($tentativas_atuais >= $limite_tentativas) {
                        // 6. Atingiu o limite: Bloqueia a conta
                        $update = $conectar->prepare("UPDATE tb_usuarios SET qt_tentativas_login = :tentativas, fl_bloqueado = TRUE WHERE cpf = :cpf");
                        $mensagem = "Você errou a senha muitas vezes. Sua conta foi bloqueada por segurança.";
                    } else {
                        // 7. Apenas incrementa as tentativas
                        $update = $conectar->prepare("UPDATE tb_usuarios SET qt_tentativas_login = :tentativas WHERE cpf = :cpf");
                        $restantes = $limite_tentativas - $tentativas_atuais;
                        $mensagem = "Senha incorreta. Você tem mais $restantes tentativa(s).";
                    }
                    
                    // Executa a atualização no banco
                    $update->bindParam(':tentativas', $tentativas_atuais);
                    $update->bindParam(':cpf', $cpf);
                    $update->execute();
                }
            }
        } else {
            // Nem o CPF existe no banco
            $mensagem = "CPF ou senha incorretos."; 
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