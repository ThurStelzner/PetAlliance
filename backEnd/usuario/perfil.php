<?php
    require_once __DIR__ . '/../../backEnd/controllers/api/usuarioController.php';

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    $metodo = $_SERVER['REQUEST_METHOD'];
    $cpf = $_SESSION['usuario_cpf'];

    if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'usuario' && isset($cpf)) {
        header('Content-Type: application/json');
        $controllerUsuario = new usuarioController();
        $controllerUsuario->read($cpf);
        exit;
    }

    require __DIR__ . "/../../frontEnd/view/perfil.html";