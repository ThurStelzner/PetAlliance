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
            $fotosPaths = [];
            $permitidos = ['jpg', 'jpeg', 'png', 'webp'];
            $diretorioUploads = __DIR__ . '/../../uploads/animais/';

            if (!empty($_FILES['fotos']['name'][0])) {
                $totalFotos = count($_FILES['fotos']['name']);
                if ($totalFotos > 10) {
                    throw new InvalidArgumentException('Máximo de 10 fotos permitidas.');
                }
                for ($i = 0; $i < $totalFotos; $i++) {
                    if ($_FILES['fotos']['error'][$i] !== UPLOAD_ERR_OK) continue;
                    if ($_FILES['fotos']['size'][$i] > MAX_FILE_SIZE) {
                        throw new InvalidArgumentException('Arquivo muito grande: ' . $_FILES['fotos']['name'][$i]);
                    }
                    $extensao = strtolower(pathinfo($_FILES['fotos']['name'][$i], PATHINFO_EXTENSION));
if (!in_array($extensao, $permitidos, true) || !validarMimeImagem($_FILES['fotos']['tmp_name'][$i])) {
                        throw new InvalidArgumentException('Tipo de imagem não permitido: ' . $_FILES['fotos']['name'][$i]);
                    }
                    $nomeArquivo = uniqid('pet_') . '.' . $extensao;
                    move_uploaded_file($_FILES['fotos']['tmp_name'][$i], $diretorioUploads . $nomeArquivo);
                    $fotosPaths[] = $nomeArquivo;
                }
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

            if (mb_strlen($nome) > 50) {
                throw new InvalidArgumentException('Nome deve ter no máximo 50 caracteres.');
            }

            if (mb_strlen($descricao) > 2000) {
                throw new InvalidArgumentException('Descrição deve ter no máximo 2000 caracteres.');
            }

            if ($dt_nascimento !== '') {
                $dataNasc = DateTime::createFromFormat('Y-m-d', $dt_nascimento);
                if (!$dataNasc || $dataNasc->format('Y-m-d') !== $dt_nascimento) {
                    throw new InvalidArgumentException('Data de nascimento inválida.');
                }
                if ($dataNasc > new DateTime()) {
                    throw new InvalidArgumentException('A data de nascimento não pode ser futura.');
                }
                if ($dt_nascimento < '2000-01-01') {
                    throw new InvalidArgumentException('A data mínima permitida é 01/01/2000.');
                }
            }

            if (!is_numeric($peso) || $peso <= 0) {
                throw new InvalidArgumentException('Peso deve ser um número maior que zero.');
            }

            $fotoCertificado = null;
            $fotoVacinacao = null;

            $diretorioUploads = __DIR__ . '/../../uploads/animais/';
            if (!is_dir($diretorioUploads)) {
                mkdir($diretorioUploads, 0755, true);
            }

            if (!empty($_FILES['arquivoCertificado']['name'])) {
                if ($_FILES['arquivoCertificado']['size'] > MAX_FILE_SIZE) {
                    throw new InvalidArgumentException('Arquivo de certificado muito grande.');
                }
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
                if ($_FILES['arquivoVacinacao']['size'] > MAX_FILE_SIZE) {
                    throw new InvalidArgumentException('Arquivo de vacinação muito grande.');
                }
                $extensao = strtolower(pathinfo($_FILES['arquivoVacinacao']['name'], PATHINFO_EXTENSION));
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];

                if (!in_array($extensao, $permitidos, true) || !validarMimeImagem($_FILES['arquivoVacinacao']['tmp_name'])) {
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
                $fotoVacinacao,
                null,
                false,
                $fotosPaths
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

    require __DIR__ . "/../../frontEnd/view/navBar.php";
    require __DIR__ . "/../../frontEnd/view/cadastrarAnimal.html";
    require __DIR__ . "/../../frontEnd/view/footer.html";
