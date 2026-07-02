<?php
    session_start();
    require_once __DIR__ . '/../backEnd/controlers/api/animalController.php';

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    $metodo = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'animais') {
        header('Content-Type: application/json');
        $controllerAnimal = new AnimalController();
        $controllerAnimal->listarAnimais();
        exit;
    }

    $flashMessage = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);

    if ($flashMessage) {
        echo '<script>window.flashMessage = ' . json_encode($flashMessage, JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT) . ';</script>';
    }

    require __DIR__ . '/../frontEnd/view/navBar.html';
    require __DIR__ . '/../frontEnd/view/home.html';
    require __DIR__ . '/../frontEnd/view/footer.html';

    $diretorioUsuario = 'uploads/usuario';
    $diretorioAnimal = 'uploads/animais';

    if(!is_dir($diretorioUsuario)) {
        mkdir($diretorioUsuario, 0755, true);
    }
    if(!is_dir($diretorioAnimal)) {
        mkdir($diretorioAnimal, 0755, true);
    }
?>