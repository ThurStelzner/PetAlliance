<?php

    require_once __DIR__ . "/../config/config.php";
    require_once __DIR__ . "/usuario.php";

    class UsuarioDAO {
        private $pdo;

        public function __construct() {
            $this->pdo = Conexao::getConexao();
        }

        function validaCPF($cpf) {
 
            // Extrai somente os números
            $cpf = preg_replace( '/[^0-9]/is', '', $cpf );
            
            // Verifica se foi informado todos os digitos corretamente
            if (strlen($cpf) != 11) {
                return false;
            }

            // Verifica se foi informada uma sequência de digitos repetidos. Ex: 111.111.111-11
            if (preg_match('/(\d)\1{10}/', $cpf)) {
                return false;
            }

            // Faz o calculo para validar o CPF
            for ($t = 9; $t < 11; $t++) {
                for ($d = 0, $c = 0; $c < $t; $c++) {
                    $d += $cpf[$c] * (($t + 1) - $c);
                }
                $d = ((10 * $d) % 11) % 10;
                if ($cpf[$c] != $d) {
                    return false;
                }
            }
            return true;

        }

        private function prepararSenha($senha) {
            if (empty($senha)) {
                return $senha;
            }

            if (password_get_info($senha)['algo'] !== 0) {
                return $senha;
            }

            return password_hash($senha, PASSWORD_DEFAULT);
        }

        public function updateFoto(Usuario $usuario) {
            try {
                $sql = "UPDATE tb_usuarios SET foto_perfil = ? WHERE cpf = ?";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([
                    $usuario->getImagem(),
                    preg_replace('/[^0-9]/', '', $usuario->getCpf())
                ]);
                return true;
            } catch (PDOException $e) {
                throw new Exception("Erro ao atualizar foto do usuário: " . $e->getMessage());
            }
        }

        public function updateUsuario(Usuario $usuario, $cpfAtual = null) {
            try {
                $sql = "UPDATE tb_usuarios SET foto_perfil = ?, cep = ?, nome = ?, email = ?, senha = ? WHERE cpf = ?";
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute([
                    $usuario->getImagem(),
                    preg_replace('/[^0-9]/', '', $usuario->getCep()),
                    $usuario->getNome(),
                    $usuario->getEmail(),
                    $this->prepararSenha($usuario->getSenha()),
                    preg_replace('/[^0-9]/', '', $cpfAtual ?? $usuario->getCpf())
                ]);
                return true;
            } catch (PDOException $e) {
                if ($e->errorInfo[1] == 1062) {
                    throw new Exception("E-mail já cadastrado.");
                }
                throw new Exception("Erro ao atualizar usuário: " . $e->getMessage());
            }
        }

        //para validar o cep precisamos da API ViaCep

        public function cadastrarUsuario(Usuario $usuario) {
            if($this->validaCPF($usuario->getCpf()) === false) {
                throw new InvalidArgumentException("CPF Informado é inválido");
            } else {
                try {
                    $sql = "INSERT INTO tb_usuarios (foto_perfil, cpf, cep, nome, email, senha) VALUES (?,?,?,?,?,?)";
                    $stmt = $this->pdo->prepare($sql);
                    $stmt->execute([
                        $usuario->getImagem(),
                        preg_replace('/[^0-9]/', '', $usuario->getCpf()),
                        preg_replace('/[^0-9]/', '', $usuario->getCep()),
                        $usuario->getNome(),
                        $usuario->getEmail(),
                        $this->prepararSenha($usuario->getSenha())
                    ]);
                    $usuario->setId($this->pdo->lastInsertId());
                    return $usuario;
                } catch (PDOException $e) {
                    if($e->errorInfo[1] == 1062) {
                        throw new InvalidArgumentException("O CPF ou E-mail informado já está cadastrado.");
                    } else if ($e->errorInfo[1] == 1406) {
                        throw new InvalidArgumentException("CPF ou CEP inválido!");
                    }
                    throw $e;
                }
            }  
        }

        public function read($cpf) {
            $sql = "SELECT * FROM tb_usuarios WHERE cpf = ?";
            
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute([$cpf]);
            $dados = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if (!$dados) return null;
            $usuario = new Usuario(
                $dados['foto_perfil'],
                $dados['cpf'],
                $dados['cep'],
                $dados['tipo_usuario'] ?? 0,
                $dados['nome'],
                $dados['email'],
                $dados['senha']
            );
            $usuario->setId($dados['id']);
        
            return $usuario;
        }
    }