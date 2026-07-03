<?php

require_once __DIR__ . "/../../config/config.php";
require_once __DIR__ . "/../../models/Denuncia.php";
require_once __DIR__ . "/../../models/DenunciaDAO.php";

class DenunciaController {

    private $dao;

    public function __construct() {
        $this->dao = new DenunciaDAO();
    }

    public function criarDenuncia(Denuncia $denuncia) {
        try {
            return $this->dao->cadastrar($denuncia);
        } catch (InvalidArgumentException $e) {
            throw $e;
        } catch (Exception $e) {
            throw $e;
        }
    }
}