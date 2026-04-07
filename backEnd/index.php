<?php
    require_once("conexao.php");
    session_start();
    $mensagem = "";

    if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $cpf = $_POST['cpf'];
        $senha = $_POST['senha'];

        $stmt = $conectar->prepare("SELECT * FROM tb_usuarios WHERE cpf = :cpf");
        $stmt->bindParam(':cpf', $cpf);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
            $bloqueado = false;

            if (!empty($usuario['dt_bloqueado_ate'])) {
                $tempo_atual = strtotime('now'); 
                $tempo_desbloqueio = strtotime($usuario['dt_bloqueado_ate']);

                if ($tempo_atual < $tempo_desbloqueio) {

                    $bloqueado = true;
                    $segundos_restantes = $tempo_desbloqueio - $tempo_atual;
                    $minutos_restantes = ceil($segundos_restantes / 60);
                    
                    $mensagem = "Conta bloqueada. Tente novamente em $minutos_restantes minuto(s).";
                } else {

                    $reset_bloqueio = $conectar->prepare("UPDATE tb_usuarios SET dt_bloqueado_ate = NULL, qt_tentativas_login = 0 WHERE cpf = :cpf");
                    $reset_bloqueio->bindParam(':cpf', $cpf);
                    $reset_bloqueio->execute();
                    
                    $usuario['tentativas_login'] = 0; 
                }
            }

            if (!$bloqueado) {
                
                if ($usuario['ds_senha'] === $senha) {

                    $reset = $conectar->prepare("UPDATE tb_usuarios SET qt_tentativas_login = 0, dt_bloqueado_ate = NULL WHERE cpf = :cpf");
                    $reset->bindParam(':cpf', $cpf);
                    $reset->execute();

                    $_SESSION["usuario_cpf"] = $usuario["cpf"];                     
                    header("Location: home.php");
                    exit;

                } else {

                    $tentativas_atuais = $usuario['qt_tentativas_login'] + 1;

                    if ($tentativas_atuais >= $limite_tentativas) {

                        $tempo_futuro = date('Y-m-d H:i:s', strtotime('+2 minutes')); 
                        
                        $update = $conectar->prepare("UPDATE tb_usuarios SET qt_tentativas_login = :tentativas, dt_bloqueado_ate = :bloqueado_ate WHERE cpf = :cpf");
                        $update->bindParam(':bloqueado_ate', $tempo_futuro);
                        $mensagem = "Muitas tentativas falhas. Conta bloqueada por 2 minutos.";
                        
                    } else {
                        $update = $conectar->prepare("UPDATE tb_usuarios SET qt_tentativas_login = :tentativas WHERE cpf = :cpf");
                        $restantes = $limite_tentativas - $tentativas_atuais;
                        $mensagem = "Senha incorreta. Você tem mais $restantes tentativa(s).";
                    }
                    
                    $update->bindParam(':tentativas', $tentativas_atuais);
                    $update->bindParam(':cpf', $cpf);
                    $update->execute();
                }
            }
        } else {
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

            <button type="submit">Login</button>

        </form>
        <a href="cadastro.php">Ainda não tenho login</a>
    </div>
    
    <footer>Pet Alliance</footer>
</body>
</html>