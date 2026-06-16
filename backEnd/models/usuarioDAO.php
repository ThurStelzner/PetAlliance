<?php

    require_once __DIR__ . "/../../backEnd/config/config.php";
    require_once __DIR__ . "/../../backEnd/models/usuario.php";

    class UsuarioDAO {
        private $pdo;

        public function __construct() {
            $this->pdo = Conexao::getConexao();
        }

        public function cadastrarUsuario(Usuario $usuario) {
            try {
                $sql = "INSERT INTO tb_usuarios (cpf, nome, email, senha) VALUES (?,?,?,?)";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([
                    $usuario->getCpf(),
                    $usuario->getNome(),
                    $usuario->getEmail(),
                    $usuario->getSenha()
                ]);
                $usuario->setId($this->pdo->lastInsertId());
                echo "cadastro realizado com sucesso!";
                return $usuario;
            } catch (PDOException $e) {
                if($e->errorInfo[1] == 1062) {
                    throw new InvalidArgumentException("O CPF ou E-mail informado já está cadastrado.");
                }
            }  
        }
        public function read($cpf) {
            $sql = "SELECT * FROM tb_usuarios WHERE cpf = ?";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$cpf]);
            $dados = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if (!$dados) return null;
            $usuario = new Usuario($dados['cpf'],$dados['senha']);
            $usuario->setId($dados['id']);
        
            return $usuario;
        }
    }