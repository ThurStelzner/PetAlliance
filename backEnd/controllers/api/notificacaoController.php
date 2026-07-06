<?php

require_once __DIR__ . "/../../config/config.php";
require_once __DIR__ . "/../../models/notificacao.php";
require_once __DIR__ . "/../../models/notificacaoDAO.php";

class NotificacaoController {
    private $dao;

    public function __construct() {
        $this->dao = new NotificacaoDAO();
    }

    public function listar($usuarioId) {
        header('Content-Type: application/json');
        try {
            $notificacoes = $this->dao->listarPorUsuario($usuarioId);
            $naoLidas = $this->dao->naoLidas($usuarioId);
            echo json_encode(['sucesso' => true, 'notificacoes' => $notificacoes, 'naoLidas' => $naoLidas]);
        } catch (Exception $e) {
            echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
        }
    }

    public function marcarLida() {
        header('Content-Type: application/json');
        try {
            $input = json_decode(file_get_contents('php://input'), true);
            $id = $input['id'] ?? null;
            if (!$id) {
                echo json_encode(['sucesso' => false, 'erro' => 'ID não informado']);
                return;
            }
            $this->dao->marcarLida($id);
            echo json_encode(['sucesso' => true]);
        } catch (Exception $e) {
            echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
        }
    }
}
