<?php

    require_once __DIR__ . "/../../backEnd/config/config.php";
    require_once __DIR__ . "/../../backEnd/models/animal.php";

    class AnimalDAO {
        private $pdo;

        public function __construct() {
            $this->pdo = Conexao::getConexao();
        }

        public function cadastrarAnimal(Animal $animal) {
            try {
                $sql = "INSERT INTO tb_pets (dono_id, foto_pet, nome, raca, cor, sexo, tipo, porte, data_nascimento, peso, descricao, vacinado, certificado_raca, foto_certificado, foto_vacinas) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([
                    $animal->getDonoid(),
                    $animal->getFotoPet(),
                    $animal->getNome(),
                    $animal->getRaca(),
                    $animal->getCor(),
                    $animal->getSexo(),
                    $animal->getTipo(),
                    $animal->getPorte(),
                    $animal->getDataNascimento(),
                    $animal->getPeso(),
                    $animal->getDescricao(),
                    $animal->getVacinado(),
                    $animal->getCertificado(),
                    $animal->getFotoCertificado(),
                    $animal->getFotoVacinas(),

                ]);
                $animal->setId($this->pdo->lastInsertId());
                return $animal;
            } catch (PDOException $e) {
                if($e->errorInfo[1] == 1062) {
                    throw new InvalidArgumentException("invalido");
                }
                throw $e;
            }
        }

        public function favoritarAnimal($usuarioId, $petId) {
            $sql = "SELECT 1 FROM tb_favoritos WHERE id_usuario = ? AND id_pet = ?";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$usuarioId, $petId]);
            $favorito = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($favorito) {
                $sqlDelete = "DELETE FROM tb_favoritos WHERE id_usuario = ? AND id_pet = ?";
                $stmtDelete = $this->pdo->prepare($sqlDelete);
                $stmtDelete->execute([$usuarioId, $petId]);
                return false;
            }

            $sqlInsert = "INSERT INTO tb_favoritos (id_pet, id_usuario) VALUES (?, ?)";
            $stmtInsert = $this->pdo->prepare($sqlInsert);
            $stmtInsert->execute([$petId, $usuarioId]);
            return true;
        }

        public function listarFavoritos($id) {
            try {
                $sql = "SELECT p.*, 1 AS favoritado
                    FROM tb_pets p
                    INNER JOIN tb_favoritos pf
                    ON p.id = pf.id_pet
                    WHERE pf.id_usuario = ?
                ";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([$id]);
                $animais = [];

                while ($dados = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
                        $dados['foto_vacinas'],
                        $dados['id'] ?? null,
                        $dados['favoritado'] ?? 1
                    );
                $animal->setId($dados['id']);
                $animais[] = $animal;
                }
                return $animais;
            } catch (PDOException $e) {
                throw $e;
            }
        }

        public function read($id) {
            $sql = "SELECT * FROM tb_pets WHERE id = ?";

            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$id]);
            $dados = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$dados) {
                return null;
            }

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
                $dados['foto_vacinas']
            );
            $animal->setId($dados['id']);

            return $animal;
        }

        public function readAll($usuarioId) {
            $sql = "SELECT p.*, 
                    EXISTS (
                        SELECT 1
                        FROM tb_favoritos f
                        WHERE f.id_pet = p.id
                            AND f.id_usuario = ?
                    ) AS favoritado
                FROM tb_pets p
                ORDER BY p.nome;";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$usuarioId]);
            $animais = [];
        
            while ($dados = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
                $dados['foto_vacinas'],
                $dados['id'] ?? null,
                $dados['favoritado'] ?? 0
              );
              $animais[] = $animal; // adiciona ao array
            }
            
            return $animais;
          }

        public function readByDonoId($donoId) {
            $sql = "SELECT * FROM tb_pets WHERE dono_id = ? ORDER BY nome";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$donoId]);
            $animais = [];
        
            while ($dados = $stmt->fetch(PDO::FETCH_ASSOC)) {
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
                $dados['foto_vacinas'],
              );
              $animal->setId($dados['id']);
              $animais[] = $animal; // adiciona ao array
            }
            
            return $animais;
        }
        public function delete($id) {
            $pdo = Conexao::getConexao();
        
            $arquivo = __DIR__ . "/../../uploads/animais/";
        
            $sql = "SELECT * FROM tb_pets WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute([$id]);
            $animal = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if ($animal) {
        
                if (
                    !empty($animal['foto_pet']) &&
                    $animal['foto_pet'] !== 'placeholder.webp' &&
                    file_exists($arquivo . $animal['foto_pet'])
                ) {
                    unlink($arquivo . $animal['foto_pet']);
                }
        
                $sql = "DELETE FROM tb_pets WHERE id = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$id]);
            }
        }


    }