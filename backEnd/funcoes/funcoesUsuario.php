<?php

    require_once __DIR__ . "/funcoes/config.php";

    function FormatarCpf($cpf) {
        try {
            $Fcpf = preg_replace("/\D/", '', $cpf);
            if(strlen($Fcpf) === 11) {
                return preg_replace("/(\d{3})(\d{3})(\d{3})(\d{2})/", "\$1.\$2.\$3-\$4", $Fcpf);
            } else {
                return "erro";
            }
        } catch (Excepion $e) {
            return "Erro: " . $e->getMessage();
        }
    }

?> 