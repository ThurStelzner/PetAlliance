<?php
    $host = "tini.click";
    $database = "pet_alliance_db";
    $user = "pet_alliance_db";
    $password = "aac4539d49ab9948233c6750924c1d4baa1bb739997f5b9f335569f531217658";
    
    try {
        $conectar = new PDO("mysql:host=$host;dbname=$database; character-set=uft8", $user, $password);
        $conectar->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        echo "<span style='color:blue;'>Conectado ao banco</span>";
    } catch (PDOException $e){
        echo "Erro de Conexão: " . $e->getMessage();
    }
?>