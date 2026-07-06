<?php

require_once __DIR__ . "/../../backEnd/config/config.php";
require_once __DIR__ . "/../../backEnd/models/mensagem.php";

class MensagemDAO {
    private $pdo;

    public function __construct() {
        $this->pdo = Conexao::getConexao();
    }

    public function enviar(Mensagem $mensagem) {
        $sql = "INSERT INTO tb_mensagens (conversa_id, remetente_id, conteudo) VALUES (?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            $mensagem->getConversaId(),
            $mensagem->getRemetenteId(),
            $mensagem->getConteudo()
        ]);
        $mensagem->setId($this->pdo->lastInsertId());
        return $mensagem;
    }

    public function listarPorConversa($conversaId, $antes = null, $limite = 50) {
        if ($antes) {
            $sql = "SELECT m.*, u.nome AS remetente_nome, u.foto_perfil AS remetente_foto
                    FROM tb_mensagens m
                    INNER JOIN tb_usuarios u ON m.remetente_id = u.id
                    WHERE m.conversa_id = ? AND m.id < ?
                    ORDER BY m.data_envio DESC
                    LIMIT ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$conversaId, $antes, $limite]);
        } else {
            $sql = "SELECT m.*, u.nome AS remetente_nome, u.foto_perfil AS remetente_foto
                    FROM tb_mensagens m
                    INNER JOIN tb_usuarios u ON m.remetente_id = u.id
                    WHERE m.conversa_id = ?
                    ORDER BY m.data_envio DESC
                    LIMIT ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$conversaId, $limite]);
        }
        return array_reverse($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    public function novasDesde($conversaId, $ultimoId) {
        $sql = "SELECT m.*, u.nome AS remetente_nome, u.foto_perfil AS remetente_foto
                FROM tb_mensagens m
                INNER JOIN tb_usuarios u ON m.remetente_id = u.id
                WHERE m.conversa_id = ? AND m.id > ?
                ORDER BY m.data_envio ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$conversaId, $ultimoId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
