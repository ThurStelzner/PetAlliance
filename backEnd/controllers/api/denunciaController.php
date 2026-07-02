<?php
    require_once __DIR__ . "/../../config/config.php";
    require_once __DIR__ . "/../../models/denuncia.php";
    require_once __DIR__ . "/../../models/denunciaDAO.php";

    class DenunciaController {
        private $dao;

        public function __construct() {
            $this->dao = new DenunciaDAO();
        }

        public function criarDenuncia() {
            $dados = json_decode(file_get_contents("php://input"), true);
        
            $denuncia = new Denuncia(
                $dados['usuario_id'],
                $dados['animal_id'],
                $dados['descricao'],
                0
            );
        
            try {
                $denunciaCadastrada = $this->dao->cadastrar($denuncia);
                echo json_encode($denunciaCadastrada);
            } catch (InvalidArgumentException $e) {
                http_response_code(400);
                echo json_encode(["erro" => "Dados inválidos: " . $e->getMessage()]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["erro" => "Erro ao cadastrar denúncia: " . $e->getMessage()]);
            }
        }
}