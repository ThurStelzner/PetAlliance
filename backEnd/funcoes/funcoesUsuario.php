<?php

    require_once "./funcoes/config.php";

    function CadastrarUsuario($cpf, $nome, $email, $senha, $pdo) {
        $sql = "INSERT INTO tb_usuarios (cpf, nm_usuario, ds_email, ds_senha) VALUES (?,?,?,?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$cpf, $nome, $email, $senha]);
    }

    function FormatarCpf($cpf) {
        $Fcpf = preg_replace("/\D/", '', $cpf);
        if(strlen($Fcpf) === 11) {
            return preg_replace("/(\d{3})(\d{3})(\d{3})(\d{2})/", "\$1.\$2.\$3-\$4", $Fcpf);
        } else {
        }
    }

?> 