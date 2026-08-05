<?php

    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require_once __DIR__ . "/../../backEnd/models/usuario.php";

    session_start();

    if(!$_SESSION['usuario_id']) {
        header('Location: /index.php');
        exit();
    }
    
    require __DIR__ . "/../views/navBar.php";

    // ProteÃ§Ã£o: Verifica se o usuÃ¡rio estÃ¡ logado
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

                if ($_FILES['imagemPerfil']['size'] > MAX_FILE_SIZE) {
                    throw new InvalidArgumentException("Arquivo muito grande. Tamanho mÃ¡ximo permitido: 100MB.");
                }

                // ValidaÃ§Ã£o de ExtensÃ£o
                $extensao = pathinfo($_FILES['imagemPerfil']['name'], PATHINFO_EXTENSION);
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];
                if (!in_array(strtolower($extensao), $permitidos) || !validarMimeImagem($_FILES['imagemPerfil']['tmp_name'])) {
                    throw new InvalidArgumentException("Tipo de imagem nÃ£o permitido. Use JPG, PNG ou WEBP.");
                }

                $dao = new UsuarioDAO();
                $cpfUsuario = $_SESSION['usuario_cpf'];
                
                // 1. Buscar usuÃ¡rio para saber qual a foto atual (para deletÃ¡-la do servidor)
                $usuario = $dao->read($cpfUsuario);
                if (!$usuario) {
                    throw new Exception("UsuÃ¡rio nÃ£o encontrado.");
                }

                $fotoAntiga = $usuario->getImagem();

                // 2. Processar novo upload
                $novoNomeArquivo = uniqid('prod_') . '.' . $extensao;
                $caminhoDestino = __DIR__ . '/../../uploads/usuario/' . $novoNomeArquivo;

                if (move_uploaded_file($_FILES['imagemPerfil']['tmp_name'], $caminhoDestino)) {
                    
                    // 3. Deletar foto antiga do servidor para nÃ£o acumular lixo
                    // NÃ£o deletamos se for a imagem padrÃ£o (placeholder)
                    if ($fotoAntiga !== "placeholder.webp" && file_exists(__DIR__ . '/../../uploads/usuario/' . $fotoAntiga)) {
                        unlink(__DIR__ . '/../../uploads/usuario/' . $fotoAntiga);
                    }

                    // 4. Atualizar no Banco de Dados
                    $usuario->setImagem($novoNomeArquivo);
                    $dao->updateFoto($usuario);

                    // 5. Atualizar a SessÃ£o para refletir a mudanÃ§a imediatamente
                    $_SESSION['usuario_imagem'] = $novoNomeArquivo;

                    header("Location: /backEnd/usuario/perfil.php?sucesso=foto_atualizada");
                    exit();
                } else {
                    throw new Exception("Erro ao mover o arquivo para a pasta de uploads.");
                }
            }
        } catch (InvalidArgumentException $e) {
            echo htmlspecialchars($e->getMessage());
            exit();
        } catch (Exception $e) {
            echo "Erro: " . htmlspecialchars($e->getMessage());
            exit();
        }
    }

    // Se nÃ£o for POST, carrega a View do formulÃ¡rio
    require __DIR__ . "/../../frontEnd/views/editarFotoUsuario.html";
