<?php
    require_once __DIR__ . "/../../config/config.php";
    require_once __DIR__ . "/../../models/usuario.php";
    require_once __DIR__ . "/../../models/usuarioDAO.php";

    class UsuarioController {
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

            // Handle file upload for profile photo
            if (!empty($_FILES['foto_perfil']) && $_FILES['foto_perfil']['error'] !== UPLOAD_ERR_NO_FILE) {
                $extensao = pathinfo($_FILES['foto_perfil']['name'], PATHINFO_EXTENSION);
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];
                if (!in_array(strtolower($extensao), $permitidos)) {
                    echo json_encode(["success" => false, "message" => "Tipo de imagem não permitido. Use JPG, PNG ou WEBP."]);
                    return;
                }

                $novaImagem = uniqid('user_') . '.' . $extensao;
                $caminhoDestino = __DIR__ . '/../../../public/uploads/usuario/' . $novaImagem;

                if (move_uploaded_file($_FILES['foto_perfil']['tmp_name'], $caminhoDestino)) {
                    // Delete old photo if not placeholder
                    $fotoAntiga = $usuarioAtual->getImagem();
                    if ($fotoAntiga !== 'placeholder.webp' && file_exists(__DIR__ . '/../../../public/uploads/usuario/' . $fotoAntiga)) {
                        @unlink(__DIR__ . '/../../../public/uploads/usuario/' . $fotoAntiga);
                    }
                    $imagem = $novaImagem;
                } else {
                    echo json_encode(["success" => false, "message" => "Erro ao fazer upload da imagem."]);
                    return;
                }
            }

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
                $_SESSION['usuario_imagem'] = $imagem;
                echo json_encode(["success" => true, "message" => "Usuário atualizado com sucesso."]);
            } catch (Exception $e) {
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        }
        public function login($cpf, $senha) {
            $cpf = preg_replace('/[^0-9]/', '', (string) $cpf);
            $usuario = $this->dao->read($cpf);

            if (!$usuario) {
                echo json_encode(["success" => false, "message" => "CPF ou senha inválidos."]);
                return;
            }

            // Suporte a senhas hashed ou texto plano (para compatibilidade)
            $senhaCorreta = password_verify($senha, $usuario->getSenha()) || ($senha === $usuario->getSenha());

            if (!$senhaCorreta) {
                echo json_encode(["success" => false, "message" => "CPF ou senha inválidos."]);
                return;
            }

            $_SESSION['usuario_cpf'] = $cpf;
            echo json_encode([
                "success" => true,
                "usuario" => [
                    "id" => $usuario->getId(),
                    "nome" => $usuario->getNome(),
                    "email" => $usuario->getEmail(),
                    "cpf" => $usuario->getCpf(),
                    "cep" => $usuario->getCep(),
                    "imagem" => $usuario->getImagem(),
                    "tipo" => $usuario->getTipo()
                ]
            ]);
        }

        public function registerFromRequest($data) {

            try {
                $imagem = 'placeholder.webp';
                $cpf = preg_replace('/[^0-9]/', '', $data['cpf']);
                $cep = preg_replace('/[^0-9]/', '', $data['cep']);
                
                $usuario = new Usuario(
                    $imagem,
                    $cpf,
                    $cep,
                    null,
                    trim($data['nome']),
                    trim($data['email']),
                    $data['senha']
                );
                
                $this->dao->cadastrarUsuario($usuario);
                echo json_encode(["success" => true, "message" => "Usuário cadastrado com sucesso."]);
            } catch (Exception $e) {
                echo json_encode(["success" => false, "message" => $e->getMessage()]);
            }
        }
    }
