<?php
    require_once __DIR__ . "/../../config/config.php";
    require_once __DIR__ . "/../../models/usuario.php";
    require_once __DIR__ . "/../../models/usuarioDAO.php";

    class usuarioController {
        private $dao;

        public function __construct() {
            $this->dao = new UsuarioDAO();
        }

        public function read($cpf) {
            $cpf = preg_replace('/[^0-9]/', '', (string) $cpf);
            $usuario = $this->dao->read($cpf);

            if (!$usuario) {
                echo json_encode(["erro" => "Usuário não encontrado."]);
                return;
            }

            echo json_encode([
                "id" => $usuario->getId(),
                "nome" => $usuario->getNome(),
                "email" => $usuario->getEmail(),
                "cpf" => $usuario->getCpf(),
                "cep" => $usuario->getCep(),
                "imagem" => $usuario->getImagem(),
                "tipo" => $usuario->getTipo()
            ]);
        }

        public function updateUsuario($usuario) {
            try {
                $this->dao->updateUsuario($usuario);
                echo json_encode(["success" => true, "message" => "Usuário atualizado com sucesso."]);
            } catch (Exception $e) {
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        }

        public function updateUsuarioFromRequest($cpf, $data) {
            $usuarioAtual = $this->dao->read($cpf);

            if (!$usuarioAtual) {
                echo json_encode(["success" => false, "message" => "Usuário não encontrado."]);
                return;
            }

            $cpfNovo = !empty($data['cpf']) ? preg_replace('/[^0-9]/', '', $data['cpf']) : $cpf;
            if (!$this->dao->validaCPF($cpfNovo)) {
                echo json_encode(["success" => false, "message" => "CPF inválido."]);
                return;
            }

            $imagem = $usuarioAtual->getImagem();
            $cep = !empty($data['cep']) ? preg_replace('/[^0-9]/', '', $data['cep']) : $usuarioAtual->getCep();
            $nome = !empty($data['nome']) ? trim($data['nome']) : $usuarioAtual->getNome();
            $email = !empty($data['email']) ? trim($data['email']) : $usuarioAtual->getEmail();
            $senha = $usuarioAtual->getSenha();

            $usuario = new Usuario(
                $imagem,
                $cpfNovo,
                $cep,
                null,
                $nome,
                $email,
                $senha
            );

            try {
                $this->dao->updateUsuario($usuario, $cpf);
                $_SESSION['usuario_cpf'] = $cpfNovo;
                echo json_encode(["success" => true, "message" => "Usuário atualizado com sucesso."]);
            } catch (Exception $e) {
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        }
        public function criarUsuario(Usuario $usuario) {
            try {
                return $this->dao->cadastrarUsuario($usuario);
            } catch (InvalidArgumentException $e) {
                throw $e;
            } catch (Exception $e) {
                throw $e;
            }
        }
    }