<?php
require_once __DIR__ . "/../config/config.php";
require_once __DIR__ . "/../models/usuarioDAO.php";
require_once __DIR__ . "/../models/usuario.php";
require_once __DIR__ . "/../models/denunciaDAO.php";
require_once __DIR__ . "/../models/denuncia.php";
require_once __DIR__ . "/../controllers/api/denunciaController.php";

session_start();

if (!isset($_SESSION['usuario_cpf'])) {
    die("Usuário não está logado.");
}

$usuarioDAO = new UsuarioDAO();
$cpf = $_SESSION['usuario_cpf'];
$usuario = $usuarioDAO->read($cpf);
$ehAdmin = $usuario && $usuario->getTipo() == 1;

if (!$ehAdmin) {
    header("Location: /backEnd/home.php?erro=acesso_negado");
    exit;
}

$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'GET' && isset($_GET['route'])) {
    $controller = new DenunciaController();

    if ($_GET['route'] === 'listar') {
        $controller->listarDenuncias();
        exit;
    }
}

if ($metodo === 'POST' && isset($_GET['route']) && $_GET['route'] === 'resolver') {
    $controller = new DenunciaController();
    $controller->resolverDenuncia();
    exit;
}

require __DIR__ . "/../../frontEnd/view/navBar.php";
require __DIR__ . "/../../frontEnd/view/adminDenuncias.html";
require __DIR__ . "/../../frontEnd/view/footer.html";