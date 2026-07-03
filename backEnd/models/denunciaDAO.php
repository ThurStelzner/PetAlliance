<?php

require_once __DIR__ . "/../../backEnd/config/config.php";
require_once __DIR__ . "/../../backEnd/models/Denuncia.php";

class DenunciaDAO {

    private $pdo;

    public function __construct() {
        $this->pdo = Conexao::getConexao();
    }

    public function cadastrar(Denuncia $denuncia) {

        $sql = "INSERT INTO tb_denuncias
                (usuario_id, tipo_alvo, alvo_id, descricao, resolvido)
                VALUES (?, ?, ?, ?, ?)";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            $denuncia->getUsuarioId(),
            $denuncia->getTipoAlvo(),
            $denuncia->getAlvoId(),
            $denuncia->getDescricao(),
            $denuncia->getResolvido()
        ]);

        return $denuncia;
    }
}