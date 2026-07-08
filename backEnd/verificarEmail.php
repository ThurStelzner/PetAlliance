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
        header("Location: /backEnd/home.php");
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
    <title>PetAlliance - Verificar Email</title>
    <link rel="stylesheet" href="/frontEnd/style/style.css">
    <style>
        .verificacao-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            padding: 20px;
        }
        .verificacao-card {
            background: #fff;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            max-width: 450px;
            width: 100%;
            text-align: center;
        }
        .verificacao-card h2 {
            margin-top: 0;
            color: #333;
        }
        .verificacao-card input[type="text"] {
            width: 200px;
            padding: 12px;
            font-size: 24px;
            letter-spacing: 8px;
            text-align: center;
            border: 2px solid #ddd;
            border-radius: 4px;
            margin: 20px 0;
        }
        .verificacao-card button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
        }
        .verificacao-card button:hover {
            background: #45a049;
        }
        .mensagem-erro {
            color: #d32f2f;
            background: #fce4e4;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .mensagem-sucesso {
            color: #2e7d32;
            background: #e8f5e9;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .reenviar {
            margin-top: 20px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .reenviar button {
            background: #2196F3;
        }
        .reenviar button:hover {
            background: #1976D2;
        }
    </style>
</head>
<body>
    <?php require __DIR__ . "/../frontEnd/view/verificarEmail.html"; ?>
    <?php require __DIR__ . "/../frontEnd/view/footer.html"; ?>
