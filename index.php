<?php

    require __DIR__ . '/frontEnd/view/index.html';
    require __DIR__ . '/frontEnd/view/footer.html';

    $diretorioUsuario = 'uploads/usuario';
    $diretorioAnimal = 'uploads/animais';


    if(!is_dir($diretorioUsuario)) {
        mkdir($diretorioUsuario, 0755, true);
    }
    if(!is_dir($diretorioAnimal)) {
        mkdir($diretorioAnimal, 0755, true);
    }

?>