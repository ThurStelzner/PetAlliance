<?php

require_once __DIR__ . "/../models/denunciaDAO.php";
require_once __DIR__ . "/../models/denuncia.php";
require_once __DIR__ . "/../controllers/api/denunciaController.php";

session_start();

if(!$_SESSION['usuario_id']) {
    header('Location: /index.php');
    exit();
}

require __DIR__ . "/../../frontEnd/view/cadastrarDenuncia.html";
require __DIR__ . "/../../frontEnd/view/footer.html";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    try {

        $usuario_id = $_SESSION["usuario_id"];
        $descricao = trim($_POST["descricao"] ?? "");
        $tipo_alvo = $_POST["tipo_alvo"] ?? $_GET["tipo"] ?? "";
        $alvo_id = $_POST["alvo_id"] ?? $_GET["id"] ?? null;
        $resolvido = 0;

        $controller = new DenunciaController();

        $controller->criarDenuncia(
            new Denuncia(
                $usuario_id,
                $tipo_alvo,
                $descricao,
                $alvo_id,
                $resolvido
            )
        );

        header("Location: /backEnd/home.php");
        exit();

    } catch (InvalidArgumentException $e) {
        echo $e->getMessage();
    } catch (PDOException $e) {
        echo $e->getMessage();
    }
}