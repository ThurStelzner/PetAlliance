<?php
    require_once __DIR__ . '/controllers/api/animalController.php';
    require_once __DIR__ . "/models/usuarioDAO.php";

    session_start();

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

    $metodo = $_SERVER['REQUEST_METHOD'];
    $usuarioId = $_SESSION['usuario_id'];

    if(!$_SESSION['usuario_id']) {
        header('Location: /index.php');
        exit();
    }

    $usuarioDAO = new UsuarioDAO();

    if (!isset($_SESSION['usuario_cpf'])) {
        die("Usuário não está logado.");
    }

    $cpf = $_SESSION['usuario_cpf'];
    $usuario = $usuarioDAO->read($cpf);

    $ehAdmin = $usuario && $usuario->getTipo() == 1;


    try {
        if ($metodo === 'GET' && isset($_GET['route']) && $_GET['route'] === 'buscar_animais') {
            header('Content-Type: application/json');
            $controllerAnimal = new AnimalController();
            $termo = $_GET['termo'] ?? '';
            $filtros = [];
            foreach (['porte', 'cor', 'tipo', 'vacinado', 'certificado'] as $f) {
                if (!empty($_GET[$f])) {
                    $filtros[$f] = $_GET[$f];
                }
            }
            $controllerAnimal->buscarAnimais($termo, $usuarioId, $filtros);
            exit;
        }

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
    } catch (Exception $e) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(["erro" => $e->getMessage()]);
        exit;
    }

    $flashMessage = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);

    if ($flashMessage){
        echo '<script>window.flashMessage = ' . json_encode($flashMessage, JSON_HEX_TAG|JSON_HEX_AMP|JSON_HEX_APOS|JSON_HEX_QUOT) . ';</script>';
    }
    try {
        if ($metodo === 'DELETE' && isset($_GET['route']) && $_GET['route'] === 'excluir_animal' && isset($_GET['id'])) {
            header('Content-Type: application/json');
            $controllerAnimal = new AnimalController();
            $controllerAnimal->deletarAnimal($_GET['id']);
            exit;
        }
    } catch (Exception $e) {
        header('Content-Type: application/json');
        http_response_code(500);
        echo json_encode(["erro" => $e->getMessage()]);
        exit;
    }

    require __DIR__ . '/../frontEnd/view/navBar.html';
    require __DIR__ . '/../frontEnd/view/home.html';

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
        window.USUARIO_ID = <?= $usuarioId ?>;
    </script>
    <?php
    require __DIR__ . '/../frontEnd/view/footer.html';
?>

