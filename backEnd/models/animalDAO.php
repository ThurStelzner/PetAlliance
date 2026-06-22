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
                $sql = "INSERT INTO tb_pets (dono_id, nome, raca, cor, sexo, tipo, porte, data_nascimento, peso, descricao, vacinado, certificado_raca,foto_certificado,foto_vacinas) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([
                    $animal->getDonoid(),
                    $animal->getNome(),
                    $animal->getRaca(),
                    $animal->getCor(),
                    $animal->getSexo(),
                    $animal->getTipo(),
                    $animal->getPorte(),
                    $animal->getDtNascimento(),
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
                $dados['nome'],
                $dados['raca'],
                $dados['cor'],
                $dados['sexo'],
                $dados['tipo'],
                $dados['porte'],
                $dados['dt_nascimento'],
                $dados['peso'],
                $dados['descricao'],
                $dados['vacinado'],
                $dados['certificado_raca'],
                $dados['foto_certificado'],
                $dados['foto_vacinas'],
            );

            $animal->setId($dados['id']);

            return $animal;
        }

        public function readAll() {
            $sql = "SELECT * FROM tb_pets ORDER BY nome";
            $stmt = $this->pdo->query($sql);
            $animais = [];
        
            while ($dados = $stmt->fetch(PDO::FETCH_ASSOC)) {
              $animal = new Animal(
                $dados['dono_id'],
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

        public function readByDonoId($donoId) {
            $sql = "SELECT * FROM tb_pets WHERE dono_id = ? ORDER BY nome";
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$donoId]);
            $animais = [];
        
            while ($dados = $stmt->fetch(PDO::FETCH_ASSOC)) {
              $animal = new Animal(
                $dados['dono_id'],
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
    }