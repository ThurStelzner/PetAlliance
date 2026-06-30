<?php
    require_once __DIR__ . '/../backEnd/controllers/api/animalController.php';

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    $metodo = $_SERVER['REQUEST_METHOD'];

    if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'animais') {
        header('Content-Type: application/json');
        $controllerAnimal = new AnimalController();
        $controllerAnimal->listarAnimais();
        exit;
    }

    if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'detalhes_animal' && isset($_GET['id'])) {
        header('Content-Type: application/json');
        $controllerAnimal = new AnimalController();
        $controllerAnimal->read($_GET['id']);
        exit;
    }

    if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'favoritar_animal' && isset($_GET['idAnimal'])) {
        $usuarioId = $_SESSION['usuario_id'];
        header('Content-Type: application/json');
        $controllerAnimal = new AnimalController();
        $controllerAnimal->favoritarAnimal($usuarioId, intval($_GET['idAnimal']));
        exit;
    }

    require __DIR__ . '/../frontEnd/view/navBar.html';
    require __DIR__ . '/../frontEnd/view/home.html';
    require __DIR__ . '/../frontEnd/view/footer.html';

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