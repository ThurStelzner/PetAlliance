<?php

    require_once __DIR__ . "/../../backEnd/config/config.php";
    require_once __DIR__ . "/../../backEnd/models/usuario.php";

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

        //para validar o cep precisamos da API ViaCep

        public function cadastrarUsuario(Usuario $usuario) {
            if(!$this->validaCPF($usuario->getCep()) === false) {
                throw new InvalidArgumentException('CPF Informado é inválido');
            } else {
                try {
                    $sql = "INSERT INTO tb_usuarios (cpf, cep, nome, email, senha) VALUES (?,?,?,?,?)";
                    $stmt = $this->pdo->prepare($sql);
                    $stmt->execute([
                        preg_replace('/[^0-9]/', '', $usuario->getCpf()),
                        preg_replace('/[^0-9]/', '', $usuario->getCep()),
                        $usuario->getNome(),
                        $usuario->getEmail(),
                        $usuario->getSenha()
                    ]);
                    $usuario->setId($this->pdo->lastInsertId());
                    return $usuario;
                } catch (PDOException $e) {
                    if($e->errorInfo[1] == 1062) {
                        throw new InvalidArgumentException("O CPF ou E-mail informado já está cadastrado.");
                    }
                    throw $e;
                }
            }
        }
    }