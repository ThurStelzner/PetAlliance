<?php

require_once __DIR__ . "/../models/denunciaDAO.php";
require_once __DIR__ . "/../models/denuncia.php";

session_start();

require __DIR__ . "/../../frontEnd/view/cadastrarDenuncia.html";
require __DIR__ . "/../../frontEnd/view/footer.html";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {

        $usuario_id = $_SESSION["usuario_id"];
        $animal_id = trim($_POST["animal_id"] ?? "");
        $descricao = trim($_POST["descricao"] ?? "");
        $tipo_alvo = $_GET["tipo"] ?? "";
        $resolvido = 0;

        $dao = new DenunciaDAO();

        $denunciaCadastrada = $dao->cadastrar(
            new Denuncia(
                $usuario_id,
                $tipo_alvo,
                $descricao,
                $animal_id !== "" ? $animal_id : null,
                $resolvido)
        );

        header("Location: /backEnd/home.php");
        exit();

    } catch (InvalidArgumentException $e) {
        echo $e->getMessage();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}