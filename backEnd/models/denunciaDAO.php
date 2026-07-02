<?php

require_once __DIR__ . "/../../backEnd/config/config.php";
require_once __DIR__ . "/../../backEnd/models/denuncia.php";

class DenunciaDAO {
    private $pdo;

    public function __construct() {
        $this->pdo = Conexao::getConexao();
    }

    public function cadastrar(Denuncia $denuncia) {

        $sql = "INSERT INTO tb_denuncias
                (usuario_id, animal_id, descricao, resolvido)
                VALUES (?, ?, ?, ?)";

        $stmt = $this->pdo->prepare($sql);

        $stmt->execute([
            $denuncia->getUsuarioId(),
            $denuncia->getAnimalId(),
            $denuncia->getDescricao(),
            $denuncia->getResolvido()
        ]);

        return $denuncia;
    }
}