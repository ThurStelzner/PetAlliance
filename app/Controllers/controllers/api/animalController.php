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

        public function listarAnimais($id) {
            $animais = $this->dao->readAll($id);
            echo json_encode($animais);
        }

        public function readByDonoId($donoId) {
            $animais = $this->dao->readByDonoId($donoId);
            echo json_encode($animais);
        }

        public function listarAnimaisFavoritos($id) {
            $favoritos = $this->dao->listarFavoritos($id);
            echo json_encode($favoritos);
        }

        public function favoritarAnimal($usuarioId, $petId) {
            $dados = json_decode(file_get_contents("php://input"), true);
            try {
                $animalFavoritado = $this->dao->favoritarAnimal($usuarioId, $petId);
                echo json_encode($animalFavoritado);
            } catch (Exception $e) {
                echo json_encode(["erro" => "Erro ao favoritar animal: " . $e->getMessage()]);
            }
        }

        public function buscarAnimais($termo, $usuarioId, $filtros = []) {
            $animais = $this->dao->search($termo, $usuarioId, $filtros);
            echo json_encode($animais);
        }

        public function criarAnimal() {
            try {
                $donoId = $_SESSION['usuario_cpf'] ?? null;
                if (!$donoId) {
                    echo json_encode(["erro" => "Usuário não autenticado."]);
                    return;
                }

                $animal = new Animal(
                    $donoId,
                    $_FILES['photo']['name'] ?? 'placeholder.webp',
                    $_POST['petName'] ?? '',
                    $_POST['breed'] ?? '',
                    $_POST['color'] ?? '',
                    $_POST['gender'] ?? '',
                    $_POST['type'] ?? '',
                    $_POST['size'] ?? '',
                    $_POST['birthDate'] ?? '',
                    $_POST['weight'] ?? '',
                    $_POST['description'] ?? '',
                    $_POST['vaccinated'] ?? '',
                    $_POST['breedCert'] ?? '',
                    $_POST['certPhoto'] ?? '',
                    $_POST['vaccinePhoto'] ?? ''
                );

                // In a real app, we would handle file uploads here 
                // But Animal model's setters are already doing some of it.
                // Let's just call the DAO.
                
                $this->dao->cadastrarAnimal($animal);
                echo json_encode(["success" => true, "message" => "Animal cadastrado com sucesso."]);
            } catch (Exception $e) {
                echo json_encode(["erro" => $e->getMessage()]);
            }
        }
        public function listarMembros($id) {
            $animais = $this->dao->listarAnimaisMembros($id);
            echo json_encode($animais);
        }

        public function deletarAnimal($id) {
            $this->dao->delete($id);
        
            echo json_encode([
                "sucesso" => true,
                "mensagem" => "Animal excluído com sucesso."
            ]);
        }
    }