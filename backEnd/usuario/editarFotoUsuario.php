<?php

    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require_once __DIR__ . "/../../backEnd/models/usuario.php";

    session_start();

    // Proteção: Verifica se o usuário está logado
    if (!isset($_SESSION['usuario_cpf'])) {
        header("Location: /backEnd/usuario/loginUsuario.php");
        exit();
    }

    if ($_SERVER['REQUEST_METHOD'] === "POST") {
        try {
            if (isset($_POST['editarFoto'])) {
                if (!isset($_FILES['imagemPerfil']) || $_FILES['imagemPerfil']['error'] === UPLOAD_ERR_NO_FILE) {
                    throw new InvalidArgumentException("Selecione uma imagem para atualizar seu perfil.");
                }

                // Validação de Extensão
                $extensao = pathinfo($_FILES['imagemPerfil']['name'], PATHINFO_EXTENSION);
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];
                if (!in_array(strtolower($extensao), $permitidos)) {
                    throw new InvalidArgumentException("Tipo de imagem não permitido. Use JPG, PNG ou WEBP.");
                }

                $dao = new UsuarioDAO();
                $cpfUsuario = $_SESSION['usuario_cpf'];
                
                // 1. Buscar usuário para saber qual a foto atual (para deletá-la do servidor)
                $usuario = $dao->read($cpfUsuario);
                if (!$usuario) {
                    throw new Exception("Usuário não encontrado.");
                }

                $fotoAntiga = $usuario->getImagem();

                // 2. Processar novo upload
                $novoNomeArquivo = uniqid('prod_') . '.' . $extensao;
                $caminhoDestino = '../../uploads/usuario/' . $novoNomeArquivo;

                if (move_uploaded_file($_FILES['imagemPerfil']['tmp_name'], $caminhoDestino)) {
                    
                    // 3. Deletar foto antiga do servidor para não acumular lixo
                    // Não deletamos se for a imagem padrão (placeholder)
                    if ($fotoAntiga !== "placeholder.webp" && file_exists('../../uploads/usuario/' . $fotoAntiga)) {
                        unlink('../../uploads/usuario/' . $fotoAntiga);
                    }

                    // 4. Atualizar no Banco de Dados
                    $usuario->setImagem($novoNomeArquivo);
                    $dao->updateFoto($usuario);

                    // 5. Atualizar a Sessão para refletir a mudança imediatamente
                    $_SESSION['usuario_imagem'] = $novoNomeArquivo;

                    header("Location: /backEnd/usuario/perfil.php?sucesso=foto_atualizada");
                    exit();
                } else {
                    throw new Exception("Erro ao mover o arquivo para a pasta de uploads.");
                }
            }
        } catch (InvalidArgumentException $e) {
            echo $e->getMessage();
            exit();
        } catch (Exception $e) {
            echo "Erro: " . $e->getMessage();
            exit();
        }
    }

    // Se não for POST, carrega a View do formulário
    require __DIR__ . "/../../frontEnd/view/editarFotoUsuario.html";
