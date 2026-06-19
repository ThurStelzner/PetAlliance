<?php

    require __DIR__ . '/frontEnd/view/index.html';
    require __DIR__ . '/frontEnd/view/footer.html';

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    header("Content-Type: application/json");

    $metodo = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $rotaBase = "/";

    if(strpos($uri, $rotaBase) === 0) {
        if($metodo === "GET") {
            $donoId = $_GET['donoid'] ?? null;
            if($donoId) {
                
            } else {
                // Lógica para listar recursos
            }
        } else if($metodo === "POST") {
            // Lógica para criar um recurso
        } else if($metodo === "PUT") {
            if($id) {
                // Lógica para atualizar um recurso específico
            } else {
                http_response_code(400);
                echo json_encode(["erro" => "ID é obrigatório para atualização"]);
            }
        } else if($metodo === "DELETE") {
            if($id) {
                // Lógica para deletar um recurso específico
            } else {
                http_response_code(400);
                echo json_encode(["erro" => "ID é obrigatório para exclusão"]);
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

?>