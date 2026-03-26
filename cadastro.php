<?php
require_once("conexao.php");
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $cpf      = $_POST["cpf"];
    $nome     = $_POST["nome"];
    $email    = $_POST["email"];
    $senha    = $_POST["senha"]; 
    $tipo_usr = 0;

    try {
        // 1. Corrigido os placeholders (faltava o ':' em alguns)
        $sql = "INSERT INTO tb_usuarios (cpf, tp_usuario, nm_usuario, ds_email, ds_senha, fl_verificado, fl_bloqueado, dt_criado_em) 
                VALUES (:cpf, :tipo, :nome, :email, :senha, 0, 0, NOW())";

        // 2. Use prepare() em vez de query()
        // ATENÇÃO: Verifique se no seu conexao.php a variável é $conexao ou $conectar
        $stmt = $conectar->prepare($sql); 

        // 3. Vinculando os valores corretamente
        $stmt->bindValue(':cpf', $cpf);
        $stmt->bindValue(':tipo', $tipo_usr);
        $stmt->bindValue(':nome', $nome);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':senha', $senha); 

        // 4. Executando a variável correta ($stmt)
        if ($stmt->execute()) {
            echo "<script>alert('Usuário cadastrado com sucesso!');</script>";
        }
    } catch (PDOException $e) {
        echo "Erro ao cadastrar: " . $e->getMessage();
    }
}
?>

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastro</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
  </head>
  <body>

    <div class="me-5 ms-5 ">
        <form method="POST">
            <div class="input-group mb-3">
                <input name="cpf" type="text" class="form-control" placeholder="123.456.789-10" aria-label="Cpf" aria-describedby="basic-addon1" required>
            </div>

            <div class="input-group mb-3">
                <input name="nome" type="text" class="form-control" placeholder="Nome:" aria-label="Nome" aria-describedby="basic-addon1" required>
            </div>

            <div class="input-group mb-3">
                <input name="email" type="text" class="form-control" placeholder="Email:" aria-label="Email" aria-describedby="basic-addon2" required>
                <span class="input-group-text" id="basic-addon2">@example.com</span>
            </div>

            <div class="input-group mb-3">
                <input name="senha" type="password" class="form-control" placeholder="Senha:" aria-label="Senha" aria-describedby="basic-addon1" required>
            </div>
        

            <button class="btn btn-success" type="submit" >Cadastrar</button>
        </form>
    </div>



    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
  </body>
</html>