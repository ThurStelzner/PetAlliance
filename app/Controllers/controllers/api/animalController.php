<?php
    require_once __DIR__ . "/../../config/config.php";
    require_once __DIR__ . "/../../models/animal.php";
    require_once __DIR__ . "/../../models/animalDAO.php";

    class AnimalController {
        private $dao;

        public function __construct() {
            $this->dao = new AnimalDAO();
        }

        private function resolveUserId($cpfOrId) {
            if (!$cpfOrId) return null;
            
            $cleanValue = preg_replace('/[^0-9]/', '', (string)$cpfOrId);
            if (!$cleanValue) return null;

            // Se tiver 11 dígitos, tratamos como CPF e buscamos o ID no banco
            if (strlen($cleanValue) === 11) {
                require_once __DIR__ . '/../../models/usuarioDAO.php';
                $userDao = new UsuarioDAO();
                $user = $userDao->read($cleanValue);
                return $user ? $user->getId() : null;
            }

            // Caso contrário, se for numérico, tratamos como ID
            if (is_numeric($cleanValue)) {
                return intval($cleanValue);
            }

            return null;
        }

        public function read($id) {
            $animal = $this->dao->read($id);
            echo json_encode($animal);
        }

        public function listarAnimais($id) {
            $userId = $this->resolveUserId($id);
            $animais = $this->dao->readAll($userId ?: 0);
            echo json_encode($animais);
        }

        public function readByDonoId($donoId) {
            $animais = $this->dao->readByDonoId($donoId);
            echo json_encode($animais);
        }

        public function listarAnimaisFavoritos($id) {
            $userId = $this->resolveUserId($id);
            if (!$userId) {
                echo json_encode([]);
                return;
            }
            $favoritos = $this->dao->listarFavoritos($userId);
            echo json_encode($favoritos);
        }

        public function favoritarAnimal($usuarioId, $petId) {
            $dados = json_decode(file_get_contents("php://input"), true);
            try {
                $userId = $this->resolveUserId($usuarioId);
                if (!$userId) {
                    throw new Exception("Usuário não encontrado para favoritar.");
                }
                $animalFavoritado = $this->dao->favoritarAnimal($userId, $petId);
                echo json_encode($animalFavoritado);
            } catch (Exception $e) {
                echo json_encode(["erro" => "Erro ao favoritar animal: " . $e->getMessage()]);
            }
        }

        public function buscarAnimais($termo, $usuarioId, $filtros = []) {
            $userId = $this->resolveUserId($usuarioId);
            if (!$userId) {
                echo json_encode(["erro" => "Usuário não encontrado."]);
                return;
            }
            $animais = $this->dao->search($termo, $userId, $filtros);
            echo json_encode($animais);
        }

        public function criarAnimal() {
            try {
                $cpf = $_SESSION['usuario_cpf'] ?? null;
                if (!$cpf) {
                    echo json_encode(["erro" => "Usuário não autenticado."]);
                    return;
                }

                require_once __DIR__ . '/../../models/usuarioDAO.php';
                $userDao = new UsuarioDAO();
                $usuario = $userDao->read($cpf);
                if (!$usuario) {
                    echo json_encode(["erro" => "Usuário não encontrado."]);
                    return;
                }
                $donoId = $usuario->getId();

                $uploadDir = __DIR__ . '/../../../../public/uploads/animais/';

                $fotoPet = 'placeholder.webp';
                if (!empty($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
                    if (in_array(strtolower($ext), ['jpg','jpeg','png','webp'])) {
                        $fotoPet = uniqid('pet_') . '.' . $ext;
                        move_uploaded_file($_FILES['photo']['tmp_name'], $uploadDir . $fotoPet);
                    }
                }

                $fotoCert = '0';
                if (!empty($_FILES['breedCert']) && $_FILES['breedCert']['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES['breedCert']['name'], PATHINFO_EXTENSION);
                    if (in_array(strtolower($ext), ['jpg','jpeg','png','webp'])) {
                        $fotoCert = uniqid('cert_') . '.' . $ext;
                        move_uploaded_file($_FILES['breedCert']['tmp_name'], $uploadDir . $fotoCert);
                    }
                }

                $fotoVaci = '0';
                if (!empty($_FILES['vaccinePhoto']) && $_FILES['vaccinePhoto']['error'] === UPLOAD_ERR_OK) {
                    $ext = pathinfo($_FILES['vaccinePhoto']['name'], PATHINFO_EXTENSION);
                    if (in_array(strtolower($ext), ['jpg','jpeg','png','webp'])) {
                        $fotoVaci = uniqid('vaci_') . '.' . $ext;
                        move_uploaded_file($_FILES['vaccinePhoto']['tmp_name'], $uploadDir . $fotoVaci);
                    }
                }

                $vacinado = ($_POST['vaccinated'] ?? '') === 'Sim' ? 1 : 0;
                $temCertificado = $fotoCert !== '0' || ($_POST['breedCert'] ?? '') === '1' ? 1 : 0;
                $peso = preg_replace('/[^0-9.]/', '', $_POST['weight'] ?? '');

                $animal = new Animal(
                    $donoId,
                    $fotoPet,
                    $_POST['petName'] ?? '',
                    $_POST['breed'] ?? '',
                    $_POST['color'] ?? '',
                    $_POST['gender'] ?? '',
                    $_POST['type'] ?? '',
                    $_POST['size'] ?? '',
                    $_POST['birthDate'] ?? '',
                    $peso,
                    $_POST['description'] ?? '',
                    $vacinado,
                    $temCertificado,
                    $fotoCert,
                    $fotoVaci
                );

                $this->dao->cadastrarAnimal($animal);
                echo json_encode(["success" => true, "message" => "Animal cadastrado com sucesso."]);
            } catch (Exception $e) {
                echo json_encode(["erro" => $e->getMessage()]);
            }
        }
        public function listarMembros($id) {
            $userId = $this->resolveUserId($id);
            $animais = $this->dao->listarAnimaisMembros($userId ?: 0);
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