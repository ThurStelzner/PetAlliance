<?php
/**
 * Ponto de entrada da aplicação PetAlliance
 * Redireciona ou carrega a view principal do frontend.
 */

// Caminho para a view principal
$viewPath = __DIR__ . '/../resources/views/index.html';

if (file_exists($viewPath)) {
    // Lê o conteúdo do arquivo HTML e o exibe
    echo file_get_contents($viewPath);
} else {
    header("HTTP/1.0 404 Not Found");
    echo "Erro: Arquivo de visualização não encontrado.";
}
?>