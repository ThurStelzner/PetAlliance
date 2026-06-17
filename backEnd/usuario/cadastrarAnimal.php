<?php

    require_once __DIR__ . "/../../backEnd/models/animalDAO.php";
    require_once __DIR__ . "/../../backEnd/models/animal.php";
    require __DIR__ . "/../../frontEnd/view/cadastrarAnimal.html";
    require __DIR__ . "/../../frontEnd/view/footer.html";

    if (!$_GET['donoid']) {
        header("Location: /index.php?erro=acesso_negado");
        exit;
    }

    if($_SERVER['REQUEST_METHOD'] === "POST") {
        try {
            $donoid =trim($_GET['donoid'?? ""]);
            $nome = trim($_POST['nome'] ?? "");
            $raca = trim($_POST['raca'] ?? "");
            $cor = trim($_POST['cor'] ?? "");
            $sexo = trim($_POST['sexo'] ?? "");
            $tipo = trim($_POST['tipo'] ?? "");
            $porte = trim($_POST['porte'] ?? "");
            $dt_nascimento = trim($_POST['dt_nascimento'] ?? "");
            $peso = trim($_POST['peso'] ?? "");
            $descricao = trim($_POST['descricao'] ?? "");
            $vacinado = trim($_POST['vacinado'] ?? "");
            $certificado = trim($_POST['certificado'] ?? "");
            

            $dao = new AnimalDAO();
            $dao->cadastrarAnimal(new Animal($donoid,$nome, $raca, $cor, $sexo, $tipo,$porte,$dt_nascimento,$peso,$descricao,$vacinado,$certificado));

            header("Location: /index.php");
            exit();
        } catch (InvalidArgumentException $e) {
            echo "Erro: " . $e->getMessage();
        } catch (PDOException $e) {
            echo "Erro: " . $e->getMessage();
        }
    }
