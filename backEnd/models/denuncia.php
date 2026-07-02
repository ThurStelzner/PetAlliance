<?php
class Denuncia {
    private $id;
    private $usuario_id;
    private $animal_id;
    private $descricao;
    private $resolvido;

    public function __construct($id = null,$usuario_id, $animal_id, $descricao, $resolvido = 0){
        $this->usuario_id = $usuario_id;
        $this->animal_id = $animal_id;
        $this->descricao = $descricao;
        $this->resolvido = $resolvido;
        $this->id = $id;
    }
    public function getId() {
        return $this->id;
    }
    public function getUsuarioId() {
        return $this->usuario_id;
    }

    public function getAnimalId() {
        return $this->animal_id;
    }

    public function getDescricao() {
        return $this->descricao;
    }

    public function getResolvido() {
        return $this->resolvido;
    }
    public function setAnimalId($animal_id) {
        $this->animal_id = $animal_id;
    }
    
    public function setUsuarioId($usuario_id) {
        $this->usuario_id = $usuario_id;
    }
    
    public function setDescricao($descricao) {
        $this->descricao = $descricao;
    }
    
    public function setResolvido($resolvido) {
        $this->resolvido = $resolvido;
    }
    
    public function setId($id) {
        $this->id = $id;
    }

}