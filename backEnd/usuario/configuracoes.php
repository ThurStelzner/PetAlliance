<?php

    session_start();

    if(!$_SESSION['usuario_id']) {
        header('Location: /index.php');
        exit();
    }

    require __DIR__ . "/../../frontEnd/view/navBar.php";
    require __DIR__ . "/../../frontEnd/view/configuracoes.html";
    require __DIR__ . "/../../frontEnd/view/footer.html";