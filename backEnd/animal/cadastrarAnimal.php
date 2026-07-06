<?php

    require_once __DIR__ . "/../../backEnd/models/animalDAO.php";
    require_once __DIR__ . "/../../backEnd/models/animal.php";
    require_once __DIR__ . "/../controllers/api/animalController.php";

    session_start();

    if(!$_SESSION['usuario_id']) {
        header('Location: /index.php');
        exit();
    }

    $donoId = $_GET['donoid'] ?? ($_POST['dono_id'] ?? ($_SESSION['usuario_id'] ?? null));
    $erro = '';

    if (!$donoId) {
        $_SESSION['flash'] = [
            'mensagem' => 'Acesso negado',
            'sucesso' => false,
            'tipo' => 'erro'
        ];
        header("Location: /backEnd/home.php");
        exit;
    }

    $controller = new AnimalController();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $fotoPet = 'placeholder.webp';
            if (!empty($_FILES['arquivoFotoPet']['name'])) {
                $extensao = strtolower(pathinfo($_FILES['arquivoFotoPet']['name'], PATHINFO_EXTENSION));
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];

                if (!in_array($extensao, $permitidos, true)) {
                    throw new InvalidArgumentException('Tipo de imagem não permitido para a foto do pet.');
                }

                $fotoPet = uniqid('pet_') . '.' . $extensao;
                move_uploaded_file(
                    $_FILES['arquivoFotoPet']['tmp_name'],
                    __DIR__ . '/../../uploads/animais/' . $fotoPet
                );
            }
            $nome = trim($_POST['nome'] ?? '');
            $raca = trim($_POST['raca'] ?? '');
            $cor = trim($_POST['cor'] ?? '');
            $sexo = trim($_POST['sexo'] ?? '');
            $tipo = trim($_POST['tipo'] ?? '');
            $porte = trim($_POST['porte'] ?? '');
            $dt_nascimento = trim($_POST['dt_nascimento'] ?? '');
            $peso = trim($_POST['peso'] ?? '');
            $descricao = trim($_POST['descricao'] ?? '');
            $vacinado = trim($_POST['vacinado'] ?? '');
            $certificado = trim($_POST['certificado'] ?? '');

            if (
                $nome === '' ||
                $raca === '' ||
                $cor === '' ||
                $sexo === '' ||
                $tipo === '' ||
                $porte === '' ||
                $peso === '' ||
                $vacinado === '' ||
                $certificado === ''
            ) {
                throw new InvalidArgumentException('Preencha todos os campos obrigatórios.');
            }

            $coresPermitidas = ["Preto", "Branco", "Cinza", "Marrom", "Outro"];
            if (!in_array($cor, $coresPermitidas, true)) {
                throw new InvalidArgumentException('Cor inválida. Selecione: Preto, Branco, Cinza, Marrom ou Outro.');
            }

            $tiposPermitidos = ["Cachorro", "Gato", "Cavalo", "Outro"];
            if (!in_array($tipo, $tiposPermitidos, true)) {
                throw new InvalidArgumentException('Tipo inválido. Selecione: Cachorro, Gato, Cavalo ou Outro.');
            }

            $fotoCertificado = null;
            $fotoVacinacao = null;

            $diretorioUploads = __DIR__ . '/../../uploads/animais/';
            if (!is_dir($diretorioUploads)) {
                mkdir($diretorioUploads, 0755, true);
            }

            if (!empty($_FILES['arquivoCertificado']['name'])) {
                $extensao = strtolower(pathinfo($_FILES['arquivoCertificado']['name'], PATHINFO_EXTENSION));
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];

                if (!in_array($extensao, $permitidos, true)) {
                    throw new InvalidArgumentException('Tipo de imagem não permitido para o certificado.');
                }

                $fotoCertificado = uniqid('cert_') . '.' . $extensao;
                move_uploaded_file(
                    $_FILES['arquivoCertificado']['tmp_name'],
                    $diretorioUploads . $fotoCertificado
                );
            }

            if (!empty($_FILES['arquivoVacinacao']['name'])) {
                $extensao = strtolower(pathinfo($_FILES['arquivoVacinacao']['name'], PATHINFO_EXTENSION));
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];

                if (!in_array($extensao, $permitidos, true)) {
                    throw new InvalidArgumentException('Tipo de imagem não permitido para a carteira de vacinação.');
                }

                $fotoVacinacao = uniqid('vac_') . '.' . $extensao;
                move_uploaded_file(
                    $_FILES['arquivoVacinacao']['tmp_name'],
                    $diretorioUploads . $fotoVacinacao
                );
            }

            $animal = new Animal(
                $donoId,
                $fotoPet,
                $nome,
                $raca,
                $cor,
                $sexo,
                $tipo,
                $porte,
                $dt_nascimento,
                $peso,
                $descricao,
                $vacinado,
                $certificado,
                $fotoCertificado,
                $fotoVacinacao
            );

            $controller->criarAnimal($animal);
            $_SESSION['flash'] = [
                'mensagem' => 'Animal cadastrado com sucesso',
                'sucesso' => true,
                'tipo' => 'sucesso'
            ];
            header('Location: /backEnd/home.php?sucesso=1');
            exit;
        } catch (InvalidArgumentException $e) {
            $erro = $e->getMessage();
        } catch (PDOException $e) {
            $erro = 'Erro ao cadastrar animal: ' . $e->getMessage();
        }
    }

    require __DIR__ . "/../../frontEnd/view/navBar.html";
    require __DIR__ . "/../../frontEnd/view/cadastrarAnimal.html";
    require __DIR__ . "/../../frontEnd/view/footer.html";
