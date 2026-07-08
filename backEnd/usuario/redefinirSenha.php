<?php

session_start();

require_once __DIR__ . "/../../backEnd/config/config.php";
require_once __DIR__ . "/../../backEnd/models/usuario.php";
require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
require_once __DIR__ . "/../../backEnd/controllers/api/usuarioController.php";

$controller = new UsuarioController();
$usuarioDAO = new UsuarioDAO();

// POST — salvar nova senha
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    header('Content-Type: application/json');

    $usuarioId = $_SESSION['recuperacao_autorizado'] ?? null;
    $senha = trim($_POST['senha'] ?? '');
    $confirmar = trim($_POST['confirmar_senha'] ?? '');

    if (!$usuarioId) {
        echo json_encode(["success" => false, "message" => "Sessão inválida. Solicite um novo código."]);
        exit();
    }

    if (!$senha || !$confirmar) {
        echo json_encode(["success" => false, "message" => "Preencha todos os campos."]);
        exit();
    }

    if ($senha !== $confirmar) {
        echo json_encode(["success" => false, "message" => "As senhas não conferem."]);
        exit();
    }

    $resultado = $controller->redefinirSenha($usuarioId, $senha);
    if ($resultado['success']) {
        $usuarioLogado = $usuarioDAO->readPorId($usuarioId);
        if ($usuarioLogado) {
            $_SESSION['usuario_id'] = $usuarioLogado->getId();
            $_SESSION['usuario_nome'] = $usuarioLogado->getNome();
            $_SESSION['usuario_cpf'] = $usuarioLogado->getCpf();
            $_SESSION['usuario_email'] = $usuarioLogado->getEmail();
            $_SESSION['usuario_imagem'] = $usuarioLogado->getImagem();
        }
        unset($_SESSION['recuperacao_autorizado']);
        unset($_SESSION['recuperacao_usuario_id']);
    }
    echo json_encode($resultado);
    exit();
}

// Verificar se está autorizado (veio do código ou token)
$usuarioId = $_SESSION['recuperacao_autorizado'] ?? null;
if (!$usuarioId) {
    header("Location: /backEnd/usuario/esqueceuSenha.php");
    exit();
}

$usuario = $usuarioDAO->readPorId($usuarioId);
if (!$usuario) {
    header("Location: /backEnd/usuario/esqueceuSenha.php");
    exit();
}

$emailOculto = substr($usuario->getEmail(), 0, 3) . '*****' . substr($usuario->getEmail(), strpos($usuario->getEmail(), '@'));

require __DIR__ . "/../../frontEnd/view/redefinirSenha.html";
require __DIR__ . "/../../frontEnd/view/footer.html";
