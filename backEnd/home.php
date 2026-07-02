<?php
    require_once __DIR__ . '/../backEnd/controllers/api/animalController.php';
    require_once __DIR__ . "/../backEnd/models/usuarioDAO.php";

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    $metodo = $_SERVER['REQUEST_METHOD'];
    $usuarioId = $_SESSION['usuario_id'];

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
        $controllerAnimal->listarAnimais($usuarioId);
        exit;
    }

    if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'detalhes_animal' && isset($_GET['id'])) {
        header('Content-Type: application/json');
        $controllerAnimal = new AnimalController();
        $controllerAnimal->read($_GET['id']);
        exit;
    }

    if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'favoritar_animal' && isset($_GET['idAnimal'])) {
        header('Content-Type: application/json');
        $controllerAnimal = new AnimalController();
        $controllerAnimal->favoritarAnimal($usuarioId, $_GET['idAnimal']);
        exit;
    }

    $flashMessage = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);

    if ($flashMessage){
        echo '<script>window.flashMessage = ' . json_encode($flashMessage, JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT) . ';</script>';
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

