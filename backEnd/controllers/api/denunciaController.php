<?php

require_once __DIR__ . "/../../config/config.php";
require_once __DIR__ . "/../../models/Denuncia.php";
require_once __DIR__ . "/../../models/DenunciaDAO.php";

class DenunciaController {

    private $dao;

    public function __construct() {
        $this->dao = new DenunciaDAO();
    }

    public function criarDenuncia() {

        session_start();

        $usuario_id = $_SESSION["usuario_id"];

        // vindo do GET ou POST
        $tipo_alvo = $_GET["tipo"] ?? $_POST["tipo_alvo"] ?? "site";
        $alvo_id = $_GET["id"] ?? $_POST["alvo_id"] ?? null;

        $descricao = trim($_POST["descricao"] ?? "");

        // validação básica
        if (empty($descricao)) {
            http_response_code(400);
            echo json_encode(["erro" => "Descrição obrigatória"]);
            return;
        }

        // regra: site não precisa de alvo
        if ($tipo_alvo !== "site" && empty($alvo_id)) {
            http_response_code(400);
            echo json_encode(["erro" => "Alvo inválido"]);
            return;
        }

        $denuncia = new Denuncia(
            $usuario_id,
            $tipo_alvo,
            $descricao,
            $alvo_id ? (int) $alvo_id : null,
            0
        );

        try {
            $this->dao->cadastrar($denuncia);

            echo json_encode([
                "sucesso" => true,
                "mensagem" => "Denúncia enviada com sucesso"
            ]);

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "erro" => "Erro ao cadastrar denúncia"
            ]);
        }
    }
}