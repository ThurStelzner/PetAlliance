<?php
session_start();

if (!isset($_SESSION['usuario_id'])) {
    header('Location: /backEnd/usuario/loginUsuario.php');
    exit;
}

$usuarioId = $_SESSION['usuario_id'];
$solicitacaoId = $_GET['solicitacao_id'] ?? null;

require __DIR__ . '/views/navBar.php';
?>
<main>
    <div>
        <aside id="chat-sidebar">
            <div>
                <h2>Conversas</h2>
                <button type="button" id="chat-toggle-sidebar" title="Fechar">✕</button>
            </div>
            <div id="conversas-list"></div>
        </aside>
        <button type="button" id="chat-toggle-main" title="Abrir conversas">☰</button>
        <section>
            <div id="chat-placeholder">
                <p>Selecione uma conversa</p>
            </div>
            <div id="chat-active">
                <div id="chat-header"></div>
                <div id="chat-messages"></div>
                <div>
                    <textarea id="chat-input" rows="2" placeholder="Digite sua mensagem..."></textarea>
                    <button id="chat-send">Enviar</button>
                </div>
            </div>
        </section>
    </div>
</main>
<script>
    window.USUARIO_ID = <?= (int) $usuarioId ?>;
    window.SOLICITACAO_ID = <?= $solicitacaoId ? json_encode($solicitacaoId) : 'null' ?>;
</script>
<script src="/frontEnd/utils/chat.js"></script>
<?php require __DIR__ . '/../frontEnd/view/footer.html'; ?>
