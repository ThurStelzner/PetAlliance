<?php

require_once __DIR__ . "/../../config/config.php";
require_once __DIR__ . "/../../models/denuncia.php";
require_once __DIR__ . "/../../models/denunciaDAO.php";

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

    public function listarDenuncias() {
        header('Content-Type: application/json');
        try {
            $denuncias = $this->dao->listar();
            echo json_encode(['sucesso' => true, 'denuncias' => $denuncias]);
        } catch (Exception $e) {
            echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
        }
    }

    public function estatisticas() {
        header('Content-Type: application/json');
        try {
            $stats = $this->dao->estatisticas();
            echo json_encode(['sucesso' => true, 'estatisticas' => $stats]);
        } catch (Exception $e) {
            echo json_encode(['sucesso' => false, 'erro' => $e->getMessage()]);
        }
    }
}