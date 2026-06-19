<?php

    require __DIR__ . '/frontEnd/view/index.html';
    require __DIR__ . '/frontEnd/view/footer.html';
    require_once __DIR__ . '/backEnd/controlers/api/animalController.php';

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Content-Type: application/json");

    $metodo = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $rotaBase = "/backEnd";

    $controllerAnimal = new AnimalController();

    if(strpos($uri, $rotaBase) === 0) {
        if($metodo === "GET") {
            $donoId = $_GET['donoid'] ?? null;
            if($donoId) {
                
            } else {
                $controllerAnimal->listarAnimais();
            }
        } else {
            http_response_code(405);
            echo json_encode(["erro" => "Método HTTP não permitido"]);
        }
    }

    $diretorioUsuario = 'uploads/usuario';
    $diretorioAnimal = 'uploads/animais';


    if(!is_dir($diretorioUsuario)) {
        mkdir($diretorioUsuario, 0755, true);
    }
    if(!is_dir($diretorioAnimal)) {
        mkdir($diretorioAnimal, 0755, true);
    }

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