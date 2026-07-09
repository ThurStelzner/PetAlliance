<?php

session_start();

require_once __DIR__ . "/config/config.php";
require_once __DIR__ . "/models/usuario.php";
require_once __DIR__ . "/models/usuarioDAO.php";
require_once __DIR__ . "/models/verificacaoDAO.php";
require_once __DIR__ . "/models/EmailService.php";
require_once __DIR__ . "/controllers/api/usuarioController.php";

$controller = new UsuarioController();

// GET ?token=xxx - verificação por link
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['token'])) {
    $token = $_GET['token'];
    $tipo = $_GET['tipo'] ?? 'verificacao';

    // Se for alteração de email, tratar separado
    if ($tipo === 'alteracao_email') {
        $resultado = $controller->confirmarAlteracaoEmail($token);
        if ($resultado['success']) {
            $usuario = $resultado['usuario'];
            $_SESSION['usuario_id'] = $usuario->getId();
            $_SESSION['usuario_nome'] = $usuario->getNome();
            $_SESSION['usuario_cpf'] = $usuario->getCpf();
            $_SESSION['usuario_email'] = $usuario->getEmail();
            $_SESSION['usuario_imagem'] = $usuario->getImagem();
            header("Location: /backEnd/home.php?email_alterado=1");
            exit();
        } else {
            $_SESSION['mensagem_erro'] = $resultado['message'];
            header("Location: /backEnd/usuario/editarPerfil.php?erro=" . urlencode($resultado['message']));
            exit();
        }
    }

    $resultado = $controller->verificarToken($token);

    if ($resultado['success']) {
        $usuario = (new UsuarioDAO())->readPorId($resultado['usuario_id']);
        if ($usuario) {
            $_SESSION['usuario_id'] = $usuario->getId();
            $_SESSION['usuario_nome'] = $usuario->getNome();
            $_SESSION['usuario_cpf'] = $usuario->getCpf();
            $_SESSION['usuario_email'] = $usuario->getEmail();
            $_SESSION['usuario_imagem'] = $usuario->getImagem();
        }
        header("Location: /backEnd/home.php?sucesso=1");
        exit();
    } else {
        $_SESSION['mensagem_erro'] = $resultado['message'];
        header("Location: /backEnd/usuario/loginUsuario.php?erro=" . urlencode($resultado['message']));
        exit();
    }
}

// POST - rotas AJAX
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['route'])) {
    header('Content-Type: application/json');

    $route = $_GET['route'];

    // Verificar código
    if ($route === 'verificar_codigo') {
        $usuarioId = $_POST['usuario_id'] ?? $_SESSION['usuario_verificacao_id'] ?? null;
        $codigo = trim($_POST['codigo'] ?? '');

        if (!$usuarioId || !$codigo) {
            echo json_encode(["success" => false, "message" => "Dados incompletos."]);
            exit();
        }

        $resultado = $controller->verificarCodigo($usuarioId, $codigo);
        if ($resultado['success']) {
            $usuarioLogado = (new UsuarioDAO())->readPorId($usuarioId);
            if ($usuarioLogado) {
                $_SESSION['usuario_id'] = $usuarioLogado->getId();
                $_SESSION['usuario_nome'] = $usuarioLogado->getNome();
                $_SESSION['usuario_cpf'] = $usuarioLogado->getCpf();
                $_SESSION['usuario_email'] = $usuarioLogado->getEmail();
                $_SESSION['usuario_imagem'] = $usuarioLogado->getImagem();
                unset($_SESSION['usuario_verificacao_id']);
            }
        }
        echo json_encode($resultado);
        exit();
    }

    // Reenviar código
    if ($route === 'reenviar') {
        $usuarioId = $_POST['usuario_id'] ?? $_SESSION['usuario_verificacao_id'] ?? null;

        if (!$usuarioId) {
            echo json_encode(["success" => false, "message" => "Usuário não identificado."]);
            exit();
        }

        if ($controller->reenviarVerificacao($usuarioId)) {
            echo json_encode(["success" => true, "message" => "Código reenviado com sucesso! Verifique seu email."]);
        } else {
            echo json_encode(["success" => false, "message" => "Erro ao reenviar código. Tente novamente."]);
        }
        exit();
    }

    echo json_encode(["success" => false, "message" => "Rota inválida."]);
    exit();
}

// Exibir tela de verificação
$usuarioId = $_GET['id'] ?? $_SESSION['usuario_verificacao_id'] ?? null;

if (!$usuarioId) {
    header("Location: /backEnd/usuario/loginUsuario.php");
    exit();
}

$_SESSION['usuario_verificacao_id'] = $usuarioId;

$usuario = (new UsuarioDAO())->readPorId($usuarioId);
if (!$usuario) {
    header("Location: /backEnd/usuario/loginUsuario.php");
    exit();
}

// Se já estiver verificado, redireciona
if ($controller->isVerificado($usuarioId)) {
    header("Location: /backEnd/usuario/loginUsuario.php");
    exit();
}

?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verificar Email - PetAlliance</title>
    <link rel="stylesheet" href="/frontEnd/style/style.css">
</head>
<body>
    <div style="padding:1rem;">
        <a href="/index.php" style="text-decoration:none;color:#244C4E;font-size:1rem;">&larr; Voltar</a>
    </div>
    <?php require __DIR__ . "/../frontEnd/view/verificarEmail.html"; ?>
    <?php require __DIR__ . "/../frontEnd/view/footer.html"; ?>
</body>
</html>
