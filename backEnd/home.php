<?php
    require_once __DIR__ . '/../backEnd/controllers/api/animalController.php';
    require_once __DIR__ . "/../backEnd/models/usuarioDAO.php";

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    $metodo = $_SERVER['REQUEST_METHOD'];
    $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

    $usuarioDAO = new UsuarioDAO();

    if (!isset($_SESSION['usuario_cpf'])) {
        die("Usuário não está logado.");
    }

    $cpf = $_SESSION['usuario_cpf'];
    $usuario = $usuarioDAO->read($cpf);

    $ehAdmin = $usuario && $usuario->getTipo() == 1;


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

    if ($metodo === 'DELETE' && isset($_GET['route']) && $_GET['route'] === 'excluir_animal' && isset($_GET['id'])) {
        $controllerAnimal = new AnimalController();
        $controllerAnimal->deletarAnimal($_GET['id']);
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

<script>
    window.EH_ADMIN = <?= $ehAdmin ? 'true' : 'false' ?>;
</script>

