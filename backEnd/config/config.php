<?php
    date_default_timezone_set('America/Sao_Paulo');

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
                    die("Erro: " . $e->getMessage());
                }
            }
            return self::$instancia;
        }
    }