<?php

    require __DIR__ . '/frontEnd/view/navBar.html';
    require __DIR__ . '/frontEnd/view/index.html';
    require __DIR__ . '/frontEnd/view/footer.html';

    if (isset($_GET['mensagem'])) {
        if ($_GET['mensagem'] === 'sucess') {
            echo 'Login foi um sucesso';
        } else {
            echo 'Ocorreu um erro';
        }
    }
        
?>