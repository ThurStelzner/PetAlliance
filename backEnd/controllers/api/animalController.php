<?php
    require_once __DIR__ . "/../../config/config.php";
    require_once __DIR__ . "/../../models/animal.php";
    require_once __DIR__ . "/../../models/animalDAO.php";

    class AnimalController {
        private $dao;

        public function __construct() {
            $this->dao = new AnimalDAO();
        }

        public function read($id) {
            $animal = $this->dao->read($id);
            echo json_encode($animal);
        }

        public function listarAnimais() {
            $animais = $this->dao->readAll();
            echo json_encode($animais);
        }

        public function readByDonoId($donoId) {
            $animais = $this->dao->readByDonoId($donoId);
            echo json_encode($animais);
        }

        public function criarAnimal() {
            $dados = json_decode(file_get_contents("php://input"), true);
            $animal = new Animal(
                $dados['dono_id'],
                $dados['foto_pet'],
                $dados['nome'],
                $dados['raca'],
                $dados['cor'],
                $dados['sexo'],
                $dados['tipo'],
                $dados['porte'],
                $dados['data_nascimento'],
                $dados['peso'],
                $dados['descricao'],
                $dados['vacinado'],
                $dados['certificado_raca'],
                $dados['foto_certificado'],
                $dados['foto_vacina']
            );
            try {
                $animalCadastrado = $this->dao->cadastrarAnimal($animal);
                echo json_encode($animalCadastrado);
            } catch (InvalidArgumentException $e) {
                http_response_code(400);
                echo json_encode(["erro" => "Dados inválidos: " . $e->getMessage()]);
            } catch (Exception $e) {
                http_response_code(500);
                echo json_encode(["erro" => "Erro ao cadastrar animal: " . $e->getMessage()]);
            }
        }
        public function deletarAnimal($id) {
            $this->dao->delete($id);
        
            echo json_encode([
                "sucesso" => true,
                "mensagem" => "Animal excluído com sucesso."
            ]);
        }
    }