<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

session_start();

require_once __DIR__ . '/../app/Controllers/config/config.php';

$controllerName = $_GET['controller'] ?? '';
$action = $_GET['action'] ?? '';

if (empty($controllerName) || empty($action)) {
    echo json_encode(["erro" => "Controller ou ação não especificados."]);
    exit;
}

$controllerPath = __DIR__ . "/../app/Controllers/controllers/api/{$controllerName}Controller.php";

if (!file_exists($controllerPath)) {
    echo json_encode(["erro" => "Controller não encontrado: {$controllerName}Controller"]);
    exit;
}

require_once $controllerPath;

$className = ucfirst($controllerName) . "Controller";
if (!class_exists($className)) {
    echo json_encode(["erro" => "Classe {$className} não encontrada."]);
    exit;
}

$controller = new $className();

if (!method_exists($controller, $action)) {
    echo json_encode(["erro" => "Ação {$action} não encontrada no controller {$className}."]);
    exit;
}

try {
    // Extract parameters from GET or POST/Body
    $params = [];
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $params = $_GET;
    } elseif (isset($_SERVER['CONTENT_TYPE']) && strpos($_SERVER['CONTENT_TYPE'], 'multipart/form-data') !== false) {
        // Handle FormData submissions (includes file uploads)
        $params = $_POST;
    } else {
        $json = file_get_contents('php://input');
        $params = json_decode($json, true) ?? $_POST;
    }

    // Map action to method call
    // Some methods take specific arguments, others take arrays
    switch ($action) {
        case 'read':
            $id = $params['id'] ?? $params['cpf'] ?? $_SESSION['usuario_cpf'] ?? null;
            $controller->$action($id);
            break;
        case 'listarAnimais':
            $id = $params['id'] ?? null;
            $controller->$action($id);
            break;
        case 'readByDonoId':
            $donoId = $params['donoId'] ?? null;
            $controller->$action($donoId);
            break;
        case 'listarAnimaisFavoritos':
            $id = $params['id'] ?? null;
            $controller->$action($id);
            break;
        case 'favoritarAnimal':
            $usuarioId = $_SESSION['usuario_cpf'] ?? $params['usuarioId'] ?? null;
            $petId = $params['petId'] ?? null;
            $controller->$action($usuarioId, $petId);
            break;
        case 'buscarAnimais':
            $termo = $params['termo'] ?? '';
            $usuarioId = $_SESSION['usuario_cpf'] ?? $params['usuarioId'] ?? null;
            $filtros = $params['filtros'] ?? [];
            $controller->$action($termo, $usuarioId, $filtros);
            break;
        case 'updateUsuarioFromRequest':
            $cpf = $_SESSION['usuario_cpf'] ?? $params['cpf'] ?? null;
            $data = $params;
            $controller->$action($cpf, $data);
            break;
        case 'registerFromRequest':
            $controller->$action($params);
            break;
        case 'login':
            $cpf = $params['cpf'] ?? null;
            $senha = $params['senha'] ?? null;
            $controller->$action($cpf, $senha);
            break;
        default:
            // Generic call for other actions
            $controller->$action(...array_values($params));
            break;
    }
} catch (Exception $e) {
    echo json_encode(["erro" => $e->getMessage()]);
}
?>
