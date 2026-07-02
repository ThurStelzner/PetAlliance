<?php
    require_once __DIR__ . "/../config/config.php";
    require_once __DIR__ . "/../models/animal.php";
    require_once __DIR__ . "/../controlers/api/animalController.php";
    require __DIR__ . "/../../frontEnd/view/meusAnimais.html";
    require __DIR__ . "/../../frontEnd/view/navBar.html";
    require __DIR__ . "/../../frontEnd/view/footer.html";

    session_start();

    $donoId = $_GET['donoid'] ?? ($_POST['dono_id'] ?? ($_SESSION['usuario_id'] ?? null));
    if(!$donoId) {
        $_SESSION['flash'] = [
            'mensagem' => 'Acesso negado',
            'sucesso' => false,
            'tipo' => 'erro'
        ];
        header("Location: /backEnd/home.php");
        exit;
    }
    $controllerAnimal = new AnimalController();
    $controllerAnimal->listarAnimaisPorDono($donoId);
    
    