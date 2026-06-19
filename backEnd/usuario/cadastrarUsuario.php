<?php

    require_once __DIR__ . "/../../backEnd/models/usuarioDAO.php";
    require_once __DIR__ . "/../../backEnd/models/usuario.php";
    require __DIR__ . "/../../frontEnd/view/cadastrarUsuario.html";
    require __DIR__ . "/../../frontEnd/view/footer.html";

    if($_SERVER['REQUEST_METHOD'] === "POST") {
        try {
            $nome = trim($_POST['nome'] ?? "");
            $cpf = trim($_POST['cpf'] ?? "");
            $cep = trim($_POST['cep'] ?? "");
            $email = trim($_POST['email'] ?? "");
            $senha = trim($_POST['senha'] ?? "");
            
            $nomeArquivo = "placeholder.webp";

            if(isset($_POST['cadastrarFoto'])) {
                if(!isset($_FILES['imagemPerfil']) || $_FILES['imagemPerfil']['error'] === UPLOAD_ERR_NO_FILE) {
                    echo "Selecione uma imagem";
                    exit();
                }
                $extensao  = pathinfo($_FILES['imagemPerfil']['name'], PATHINFO_EXTENSION);
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];
                if (!in_array(strtolower($extensao), $permitidos)) {
                    echo 'Tipo de imagem não permitido.';
                    exit();
                } else {
                    $dao = new UsuarioDAO();
                    $nomeArquivo = uniqid('prod_') . '.' . $extensao;
                    move_uploaded_file($_FILES['imagemPerfil']['tmp_name'], '../../uploads/usuario/' . $nomeArquivo);
                    $dao->cadastrarUsuario(new Usuario($nomeArquivo, $cpf, $cep, $nome, $email, $senha));;
                    header("Location: /index.php");
                    exit();
                }
            }

            $dao = new UsuarioDAO();
            $dao->cadastrarUsuario(new Usuario($nomeArquivo, $cpf, $cep, $nome, $email, $senha));

            header("Location: /index.php?sucesso=1");
            exit();
        } catch (InvalidArgumentException $e) {
            echo $e->getMessage();
        } catch (PDOException $e) {
            echo $e->getMessage();
        }
    }
