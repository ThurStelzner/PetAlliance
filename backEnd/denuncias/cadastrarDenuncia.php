<?php

require_once __DIR__ . "/../models/denunciaDAO.php";
require_once __DIR__ . "/../models/denuncia.php";

require __DIR__ . "/../../frontEnd/view/cadastrarDenuncia.html";
require __DIR__ . "/../../frontEnd/view/footer.html";

session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $usuario_id = $_SESSION["usuario_id"];
    $animal_id = $_POST["animal_id"];
    $descricao = $_POST["descricao"];

    $dao = new DenunciaDAO();

    $denuncia = new Denuncia(
        $usuario_id,
        $animal_id,
        $descricao,
        0
    );

    $dao->cadastrar($denuncia);

    header("Location: /backEnd/home.php");
    exit();
}