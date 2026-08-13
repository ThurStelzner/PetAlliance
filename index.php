<<<<<<< HEAD
﻿<?php
    $diretorioUsuario = 'uploads/usuario';
    $diretorioAnimal = 'uploads/animais';
    
    if(!is_dir($diretorioUsuario)) {
        mkdir($diretorioUsuario, 0755, true);
    }
    if(!is_dir($diretorioAnimal)) {
        mkdir($diretorioAnimal, 0755, true);
    }
=======
<?php
session_start();

$diretorioUsuario = 'uploads/usuario';
$diretorioAnimal = 'uploads/animais';

if (!is_dir($diretorioUsuario)) {
    mkdir($diretorioUsuario, 0755, true);
}
>>>>>>> d7c8c99a49bf17e8f8a3af0231d4be6a28ff4bd3

if (!is_dir($diretorioAnimal)) {
    mkdir($diretorioAnimal, 0755, true);
}

require __DIR__ . '/frontEnd/views/index.html';