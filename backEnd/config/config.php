<?php
    function carregarEnv() {
        $arquivo = __DIR__ . '/../../.env';
        if (!file_exists($arquivo)) {
            return;
        }
        $linhas = file($arquivo, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        foreach ($linhas as $linha) {
            $linha = trim($linha);
            if ($linha === '' || str_starts_with($linha, '#')) {
                continue;
            }
            $partes = explode('=', $linha, 2);
            if (count($partes) === 2) {
                $chave = trim($partes[0]);
                $valor = trim($partes[1]);
                $valor = trim($valor, '"\'');
                putenv("$chave=$valor");
                $_ENV[$chave] = $valor;
            }
        }
    }

    carregarEnv();

    class Conexao {
        private static $instancia = null;

        public static function getConexao() {
            if(self::$instancia === null) {
                try {
                    self::$instancia = new PDO(
                        "mysql:host=tini.click;dbname=pet_alliance_db;charset=utf8",
                        "pet_alliance_db",
                        "aac4539d49ab9948233c6750924c1d4baa1bb739997f5b9f335569f531217658"
                    );
                    self::$instancia->setAttribute(
                        PDO::ATTR_ERRMODE,
                        PDO::ERRMODE_EXCEPTION
                    );
                } catch (PDOException $e){
                    die("Erro: " . $e->getMessage());
                }
            }
            return self::$instancia;
        }
    }