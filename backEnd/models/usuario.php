<?php

class Usuario {
    private $imagem;
    private $cpf;
    private $cep;
    private $nome;
    private $email;
    private $senha;
    private $id;

    public function __construct($imagem, $cpf, $cep, $nome, $email, $senha, $id = null) {
        $this->imagem = $imagem;
        $this->cpf = $cpf;
        $this->cep = $cep;
        $this->nome = $nome;
        $this->email = $email;
        $this->senha = $senha;
        $this->id = $id;
    }

    public function getImagem() {
        return $this->imagem;
    }

    public function getId() {
        return $this->id;
    }

    public function getCpf() {
        return $this->cpf;
    }

    public function getCep() {
        return $this->cep;
    }

    public function getNome() {
        return $this->nome;
    }

    public function getEmail() {
        return $this->email;
    }

    public function getSenha() {
        return $this->senha;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function setImagem($imagem) {
        $this->imagem = $imagem;
    }

    public function setCpf($cpf) {
        if (empty($cpf)) {
          throw new Exception("Cpf não pode ser vazio");
        }
        $this->cpf = $cpf;
    }

    public function setCep($cep) {
        $this->cep = $cep;
    }

    public function setNome($nome) {
        $this->nome = $nome;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function setSenha($senha) {
        $this->senha = $senha;
    }
}