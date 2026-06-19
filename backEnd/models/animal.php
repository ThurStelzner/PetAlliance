<?php

class Animal implements JsonSerializable {
    private $dono_id;
    private $nome;
    private $raca;
    private $cor;
    private $sexo;
    private $tipo;
    private $porte;
    private $dt_nascimento;
    private $peso;
    private $descricao;
    private $vacinado;
    private $certificado;
    private $foto_certificado;
    private $foto_vacina;

    private $id;

    public function __construct($dono_id,$nome,$raca,$cor,$sexo,$tipo,$porte,$dt_nascimento,$peso,$descricao,$vacinado,$certificado,$foto_certificado,$foto_vacina,$id = null
    ) {
        $this->dono_id = $dono_id;
        $this->nome = $nome;
        $this->raca = $raca;
        $this->cor = $cor;
        $this->sexo = $sexo;
        $this->tipo = $tipo;
        $this->porte = $porte;
        $this->dt_nascimento = $dt_nascimento;
        $this->peso = $peso;
        $this->descricao = $descricao;
        $this->vacinado = $vacinado;
        $this->certificado = $certificado;
        $this->foto_certificado =$foto_certificado;
        $this->foto_vacina = $foto_vacina;
        $this->id = $id;
    }


    public function getId() {
        return $this->id;
    }

    public function getDonoid() {
        return $this->dono_id;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getRaca() {
        return $this->raca;
    }

    public function getCor() {
        return $this->cor;
    }

    public function getSexo() {
        return $this->sexo;
    }

    public function getTipo() {
        return $this->tipo;
    }

    public function getPorte() {
        return $this->porte;
    }

    public function getDtNascimento() {
        return $this->dt_nascimento;
    }

    public function getPeso() {
        return $this->peso;
    }

    public function getDescricao() {
        return $this->descricao;
    }

    public function getVacinado() {
        return $this->vacinado;
    }

    public function getCertificado() {
        return $this->certificado;
    }

    public function getFotoCertificado() {
        return $this->foto_certificado;
    }

    public function getFotoVacinas() {
        return $this->foto_vacina;
    }


    public function setId($id) {
        $this->id = $id;
    }

    public function setDonoid($donoid) {
        $this->dono_id = $donoid;
    }

    public function setRaca($raca) {
        $this->raca = $raca;
    }

    public function setCor($cor) {
        $this->cor = $cor;
    }

    public function setSexo($sexo) {
        $this->sexo = $sexo;
    }

    public function setTipo($tipo) {
        $this->tipo = $tipo;
    }

     public function setPorte($porte) {
        $this->porte = $porte;
    }
    
     public function setDtNascimento($dt_nascimento) {
        $this->dt_nascimento = $dt_nascimento;
    }

     public function setPeso($peso) {
        $this->peso = $peso;
    }

     public function setDescricao($descricao) {
        $this->descricao = $descricao;
    }

     public function setVacinado($vacinado) {
        $this->vacinado = $vacinado;
    }

    public function setFotoCertificado($foto_certificado) {
        $this->foto_certificado = $foto_certificado;
    }

    public function setFotoVacina($foto_vacina) {
        $this->foto_vacina = $foto_vacina;
    }

     public function setCertificado($certificado) {
        $this->certificado = $certificado;
    }

    public function jsonSerialize(): array {
        return [
            'id' => $this->id,
            'dono_id' => $this->dono_id,
            'nome' => $this->nome,
            'raca' => $this->raca,
            'cor' => $this->cor,
            'sexo' => $this->sexo,
            'tipo' => $this->tipo,
            'porte' => $this->porte,
            'dt_nascimento' => $this->dt_nascimento,
            'peso' => $this->peso,
            'descricao' => $this->descricao,
            'vacinado' => $this->vacinado,
            'certificado' => $this->certificado,
            'foto_certificado' => $this->foto_certificado,
            'foto_vacina' => $this->foto_vacina,
        ];
    }
}