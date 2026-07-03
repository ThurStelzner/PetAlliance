<?php
    require_once __DIR__ . "/../config/config.php";
    require_once __DIR__ . "/../models/animal.php";
    require_once __DIR__ . "/../controllers/api/animalController.php";
    
    session_start();

    if(!$_SESSION['usuario_id']) {
        header('Location: /index.php');
        exit();
    }


    $donoId = $_GET['donoid'] ?? ($_POST['dono_id'] ?? ($_SESSION['usuario_id'] ?? null));

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    $metodo = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'animais') {
        header('Content-Type: application/json');
        $controllerAnimal = new AnimalController();
        $controllerAnimal->readByDonoId($donoId);
        exit;
    }

    if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'detalhes_animal' && isset($_GET['id'])) {
        header('Content-Type: application/json');
        $controllerAnimal = new AnimalController();
        $controllerAnimal->read($_GET['id']);
        exit;
    }

    require __DIR__ . "/../../frontEnd/view/navBar.html";
    require __DIR__ . "/../../frontEnd/view/meusAnimais.html";
    require __DIR__ . "/../../frontEnd/view/footer.html";
