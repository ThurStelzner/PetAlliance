<?php
    require_once __DIR__ . '/../backEnd/controlers/api/animalController.php';

    session_start();

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

    if (isset($_GET['mensagem'])) {
        if ($_GET['mensagem'] === 'animal_cadastrado') {
            echo 'Animal cadastrado com sucesso';
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