<?php
require_once __DIR__ . "/../config/config.php";
require_once __DIR__ . "/../models/denunciaDAO.php";
require_once __DIR__ . "/../models/denuncia.php";
require_once __DIR__ . "/../models/usuarioDAO.php";
require_once __DIR__ . "/../controllers/api/denunciaController.php";

session_start();

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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

    if ($_GET['route'] === 'estatisticas') {
        $controller->estatisticas();
        exit;
    }
}

if ($metodo === 'POST' && isset($_GET['route']) && $_GET['route'] === 'resolver') {
    $controller = new DenunciaController();
    $controller->resolverDenuncia();
    exit;
}

if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'sistema') {
    header('Content-Type: application/json');
    try {
        $pdo = Conexao::getConexao();
        $totalUsuarios = $pdo->query("SELECT COUNT(*) FROM tb_usuarios")->fetchColumn();
        $totalAnimais = $pdo->query("SELECT COUNT(*) FROM tb_pets")->fetchColumn();
        $totalDenuncias = $pdo->query("SELECT COUNT(*) FROM tb_denuncias")->fetchColumn();
        echo json_encode([
            'sucesso' => true,
            'sistema' => [
                'totalUsuarios' => (int) $totalUsuarios,
                'totalAnimais' => (int) $totalAnimais,
                'totalDenuncias' => (int) $totalDenuncias,
            ]
        ]);
    } catch (Exception $e) {
        echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
    }
    exit;
}

require __DIR__ . "/../../frontEnd/view/navBar.html";
require __DIR__ . "/../../frontEnd/view/admin.html";
?>
<script>
    window.EH_ADMIN = true;
</script>
<?php
require __DIR__ . "/../../frontEnd/view/footer.html";
