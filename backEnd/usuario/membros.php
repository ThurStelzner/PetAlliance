<?php
    require_once __DIR__ . "/../../backEnd/config/config.php";

    session_start();

    if(!$_SESSION['usuario_id']) {
        header('Location: /index.php');
        exit();
    }

    require __DIR__ . "/../../frontEnd/view/navBar.php";
    require __DIR__ . "/../../frontEnd/view/membros.php";
    require __DIR__ . "/../../frontEnd/view/footer.html";