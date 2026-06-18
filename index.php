<?php

    require __DIR__ . '/frontEnd/view/index.html';
    require __DIR__ . '/frontEnd/view/footer.html';

    if (isset($_GET['mensagem'])) {
        if ($_GET['mensagem'] === 'sucess') {
            echo 'Login foi um sucesso';
        } else {
             echo "<p id='mensagem-erro' class='erro-escondido'>mensagem de erro</p>";
        }
    }
    if (isset($_GET['erro'])) {
        if ($_GET['erro'] === 'acesso_negado') {
            echo 'Você não pode entrar aqui';
        } else {
            echo 'Ocorreu um erro';
        }
    }
        
?>