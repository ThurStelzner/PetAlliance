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

    if (isset($_GET['mensagem'])) {
        if ($_GET['mensagem'] === 'sucess') {
            echo 'Login foi um sucesso';
        } else {
             echo "<p id='mensagem-erro' class='erro-escondido'>mensagem de erro</p>";
        }
    }
    if (isset($_GET['erro'])) {
        if ($_GET['erro'] === 'acesso_negado') {
            echo 'Você não pode entrar aqui';
        } else {
            echo 'Ocorreu um erro';
        }
    }

?>