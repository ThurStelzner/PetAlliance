<?php
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PetAlliance</title>
    <link rel="stylesheet" href="/frontEnd/style/style.css">
</head>
<body>
    <nav>
        <h1>NavBar aqui</h1>
        <ul>
            <img src="/uploads/usuario/<?= htmlspecialchars($_SESSION['usuario_imagem'] ?? 'placeholder.webp') ?>" alt="Foto do Usuário" style="width: 10rem; height: 10rem; object-fit: cover;">
            <li><a href="/backEnd/home.php">Inicio</a></li>
            <li><a href="/backEnd/usuario/membros.php">Membros</a></li>
            <li><a href="/backEnd/animal/favoritos.php">Favoritos</a></li>
            <li><a href="/backEnd/animal/meusAnimais.php">Meus Animais</a></li>
            <button type="button" class="btn btn-menu" commandFor="menu" command="show-modal">Menu</button>
        </ul>

        <dialog id="menu">
            <button type="button" class="btn btn-close" commandFor="menu" command="close">X</button>
            <ul>
                <li><a href="/backEnd/animal/cadastrarAnimal.php">Cadastrar Animal</a></li>
                <li><a href="/backEnd/usuario/perfil.php">Perfil</a></li>
                <li><a href="/backEnd/usuario/configuracoes.php">Configuracoes</a></li>
                <li><a href="/backEnd/chat.php">Chat</a></li>
                <li><a href="/backEnd/match.php">Notificações</a></li>
                <?php if (isset($_SESSION['usuario_tipo']) && $_SESSION['usuario_tipo'] == 1): ?>
                    <li><a href="/backEnd/admin/denuncias.php">Denúncias</a></li>
                    <li><a href="/backEnd/admin/estatisticas.php">Estatísticas</a></li>
                <?php endif; ?>
            </ul>
        </dialog>
    </nav>

    <script src="/frontEnd/utils/navBar.js"></script>