<?php
    include_once('usuarioDAO.php');


    $usuarioDAO = new UsuarioDAO();

class Animal {
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
        if (!filter_var($id, FILTER_VALIDATE_INT) || $id <= 0) {
            throw new Exception("ID inválido.");
        }
    
        $this->id = (int) $id;
    }

    public function setDonoid($donoid) {
        if (!filter_var($donoid, FILTER_VALIDATE_INT) || $donoid <= 0) {
            throw new Exception("ID do dono inválido.");
        }
    
        $this->dono_id = (int) $donoid;
    }
    
    public function setRaca($raca) {
        $raca = trim($raca);

        if ($raca === '') {
            throw new Exception("Raça não pode ser vazia.");
        }
    
        if (mb_strlen($raca) > 80) {
            throw new Exception("Raça pode ter no máximo 80 caracteres.");
        }
        $this->raca = $raca;
    }

    public function setSexo($sexo) {
        if (!in_array($sexo, ["Macho", "Fêmea"], true)) {
            throw new Exception("Sexo inválido.");
        }
        $this->sexo = $sexo;
    }

    public function setTipo($tipo) {
        if (empty($tipo)) {
            throw new Exception("Tipo não pode ser vazio.");
        }
        $this->tipo = $tipo;
    }

    public function setPorte($porte) {
        if (!in_array($porte, ["Pequeno", "Médio", "Grande"], true)) {
            throw new Exception("Porte inválido.");
        }
    
        $this->porte = $porte;
    }
    
    public function setDtNascimento($dt_nascimento) {
        if (empty($dt_nascimento)) {
            throw new Exception("Data de nascimento não pode ser vazia.");
        }
    
        $data = DateTime::createFromFormat("Y-m-d", $dt_nascimento);
    
        if (!$data || $data->format("Y-m-d") !== $dt_nascimento) {
            throw new Exception("Data de nascimento inválida.");
        }
        if ($dt_nascimento < '2000-01-01') {
            echo 'Erro: A data escolhida é menor que a data mínima permitida.';
        } else {
            echo 'Sucesso: Data válida!';
        }
    
        $this->dt_nascimento = $dt_nascimento;
    }

    public function setPeso($peso) {
        if (!is_numeric($peso) || $peso < 0) {
            throw new Exception("Peso deve ser um número maior que zero.");
        }
    
        $this->peso = $peso;
    }

     public function setDescricao($descricao) {
            if (empty($descricao)) {
                throw new Exception("Descrição não pode ser vazia.");
            }
        $this->descricao = $descricao;
    }

    public function setVacinado($vacinado) {
        if (!in_array($vacinado, [0, 1, "0", "1"], true)) {
            throw new Exception("Valor de vacinação inválido.");
        }
    
        $this->vacinado = (int) $vacinado;
    }
    
    public function setCertificado($certificado) {
        if (!in_array($certificado, [0, 1, "0", "1"], true)) {
            throw new Exception("Valor de certificado inválido.");
        }
    
        $this->certificado = (int) $certificado;
    }

    public function setFotoCertificado($foto_certificado) {
        $this->foto_certificado = $foto_certificado;
        if (!empty($_FILES['arquivoCertificado']['name'])) {
                $extensao  = pathinfo($_FILES['arquivoCertificado']['name'], PATHINFO_EXTENSION);
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];
            
                if (!in_array(strtolower($extensao), $permitidos)) {
                    $erro = 'Tipo de imagem não permitido.';
                    header("Location: /index.php");
                    exit();
                    
                } else {
                    $foto_certificado = uniqid('prod_') . '.' . $extensao;
                    move_uploaded_file($_FILES['arquivoCertificado']['tmp_name'], '../../uploads/animais/' . $foto_certificado);
                }
        }
            
    }

    public function setFotoVacina($foto_vacina) {
        $this->foto_vacina = $foto_vacina;
        if (!empty($_FILES['arquivoVacinacao']['name'])) {
                $extensao  = pathinfo($_FILES['arquivoVacinacao']['name'], PATHINFO_EXTENSION);
                $permitidos = ['jpg', 'jpeg', 'png', 'webp'];
            
                if (!in_array(strtolower($extensao), $permitidos)) {
                    $erro = 'Tipo de imagem não permitido.';
                } else {
                    $foto_vacina = uniqid('prod_') . '.' . $extensao;
                    move_uploaded_file($_FILES['arquivoVacinacao']['tmp_name'], '../../uploads/animais/' . $foto_vacina);
                }
            }
        }

}