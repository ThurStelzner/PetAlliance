<?php

    require_once __DIR__ . "/../../backEnd/models/animalDAO.php";
    require_once __DIR__ . "/../../backEnd/models/animal.php";
    
    if (!isset($_GET['donoid'])) {
      
        header("Location: /home.php?erro=acesso_negado");
        exit;
    }

    $dao = new AnimalDAO();
    $animais = $dao->readAll();
    
    if($_SERVER['REQUEST_METHOD'] === "POST") {
        try {
            $dono_id =trim($_GET['donoid']?? "");
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
            $foto_vacina = null;
            $foto_certificado = null;

            
            

            
            $dao->cadastrarAnimal(new Animal($dono_id,$nome, $raca, $cor, $sexo, $tipo,$porte,$dt_nascimento,$peso,$descricao,$vacinado,$certificado,$foto_vacina,$foto_certificado));
            header("Location: /home.php?sucesso=1");
            exit();
        } catch (InvalidArgumentException $e) {
            echo "Erro: " . $e->getMessage();
        } catch (PDOException $e) {
            echo "Erro: " . $e->getMessage();
        }
    }


require __DIR__ . "/../../frontEnd/view/cadastrarAnimal.html";
require __DIR__ . "/../../frontEnd/view/footer.html";
