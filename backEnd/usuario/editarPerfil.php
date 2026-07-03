<?php
    require_once __DIR__ . '/../../backEnd/controllers/api/usuarioController.php';

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    $metodo = $_SERVER['REQUEST_METHOD'];
    $cpf = isset($_SESSION['usuario_cpf']) ? preg_replace('/[^0-9]/', '', $_SESSION['usuario_cpf']) : null;

    $isAjax = !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) === 'xmlhttprequest';
    $acceptHeader = $_SERVER['HTTP_ACCEPT'] ?? '';
    $wantsJson = (isset($_GET['route']) && $_GET['route'] === 'usuario') || $isAjax || (strpos($acceptHeader, 'application/json') !== false);

    if ($metodo === 'GET' && $wantsJson && isset($cpf)) {
        header('Content-Type: application/json');
        $controllerUsuario = new usuarioController();
        $controllerUsuario->read($cpf);
        exit;
    }

    if ($metodo === 'POST' && $wantsJson && isset($cpf)) {
        header('Content-Type: application/json');

        $data = $_POST;
        if (empty($data)) {
            $rawData = file_get_contents('php://input');
            if (!empty($rawData)) {
                $decodedData = json_decode($rawData, true);
                if (is_array($decodedData)) {
                    $data = $decodedData;
                }
            }
        }

        if (!empty($data['nome']) && !empty($data['email']) && !empty($data['cep'])) {
            $controllerUsuario = new usuarioController();
            $controllerUsuario->updateUsuarioFromRequest($cpf, $data);
        } else {
            echo json_encode(["success" => false, "message" => "Dados incompletos para atualização."]);
        }
        exit;
    }

    require __DIR__ . "/../../frontEnd/view/editarPerfil.html";