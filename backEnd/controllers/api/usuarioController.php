<?php
    require_once __DIR__ . "/../../config/config.php";
    require_once __DIR__ . "/../../models/usuario.php";
    require_once __DIR__ . "/../../models/usuarioDAO.php";

    class usuarioController {
        private $dao;

        public function __construct() {
            $this->dao = new UsuarioDAO();
        }

        public function read($cpf) {
            $usuario = $this->dao->read($cpf);
            echo json_encode($usuario);
        }
        public function criarUsuario(Usuario $usuario) {
            try {
                return $this->dao->cadastrarUsuario($usuario);
            } catch (InvalidArgumentException $e) {
                throw $e;
            } catch (Exception $e) {
                throw $e;
            }
        }
    }