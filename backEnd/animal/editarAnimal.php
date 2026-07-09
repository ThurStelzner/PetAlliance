<?php
    require_once __DIR__ . "/../../backEnd/models/animalDAO.php";
    require_once __DIR__ . "/../../backEnd/models/animal.php";

    session_start();

    if(!$_SESSION['usuario_id']) {
        header('Location: /index.php');
        exit();
    }

    $usuarioId = $_SESSION['usuario_id'];
    $animalId = $_GET['id'] ?? null;

    if (!$animalId) {
        header('Location: /backEnd/home.php');
        exit();
    }

    $dao = new AnimalDAO();
    $animal = $dao->read($animalId);

    if (!$animal || $animal->getDonoId() != $usuarioId) {
        header('Location: /backEnd/home.php');
        exit();
    }

    $erro = '';
    $sucesso = '';

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        try {
            $animal->setNome(trim($_POST['nome'] ?? ''));
            $animal->setRaca(trim($_POST['raca'] ?? ''));
            $animal->setCor(trim($_POST['cor'] ?? ''));
            $animal->setSexo(trim($_POST['sexo'] ?? ''));
            $animal->setTipo(trim($_POST['tipo'] ?? ''));
            $animal->setPorte(trim($_POST['porte'] ?? ''));
            $animal->setDtNascimento(trim($_POST['dt_nascimento'] ?? ''));
            $animal->setPeso(trim($_POST['peso'] ?? ''));
            $animal->setDescricao(trim($_POST['descricao'] ?? ''));
            $animal->setVacinado(trim($_POST['vacinado'] ?? ''));
            $animal->setCertificado(trim($_POST['certificado'] ?? ''));

            $dao->atualizarAnimal($animal);

            $diretorioUploads = __DIR__ . '/../../uploads/animais/';
            $permitidos = ['jpg', 'jpeg', 'png', 'webp'];

            if (!empty($_FILES['novas_fotos']['name'][0])) {
                $totalNovas = count($_FILES['novas_fotos']['name']);
                $fotosAtuais = $dao->carregarFotos($animal->getId());
                if (count($fotosAtuais) + $totalNovas > 10) {
                    throw new InvalidArgumentException('Limite de 10 fotos excedido.');
                }
                for ($i = 0; $i < $totalNovas; $i++) {
                    if ($_FILES['novas_fotos']['error'][$i] !== UPLOAD_ERR_OK) continue;
                    if ($_FILES['novas_fotos']['size'][$i] > MAX_FILE_SIZE) {
                        throw new InvalidArgumentException('Arquivo muito grande: ' . $_FILES['novas_fotos']['name'][$i]);
                    }
                    $extensao = strtolower(pathinfo($_FILES['novas_fotos']['name'][$i], PATHINFO_EXTENSION));
                    if (!in_array($extensao, $permitidos, true)) {
                        throw new InvalidArgumentException('Tipo de imagem não permitido: ' . $_FILES['novas_fotos']['name'][$i]);
                    }
                    $nomeArquivo = uniqid('pet_') . '.' . $extensao;
                    move_uploaded_file($_FILES['novas_fotos']['tmp_name'][$i], $diretorioUploads . $nomeArquivo);
                    $dao->adicionarFoto($animal->getId(), $nomeArquivo);
                }
            }

            $sucesso = 'Animal atualizado com sucesso!';
        } catch (Exception $e) {
            $erro = $e->getMessage();
        }
    }

    $fotos = $dao->carregarFotos($animal->getId());

    require __DIR__ . "/../views/navBar.php";
    require __DIR__ . "/../../frontEnd/view/editarAnimal.html";
