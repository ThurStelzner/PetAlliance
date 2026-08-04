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
    date_default_timezone_set('America/Sao_Paulo');

    define('MAX_FILE_SIZE', 100 * 1024 * 1024);

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
                    self::$instancia->exec("SET time_zone = 'America/Sao_Paulo'");
                } catch (PDOException $e){
                    error_log("Erro de conexão: " . $e->getMessage());
                    throw new InvalidArgumentException("Erro ao conectar ao banco de dados. Tente novamente mais tarde.");
                }
            }
            return self::$instancia;
        }
    }