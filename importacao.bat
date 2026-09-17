@echo off
setlocal EnableDelayedExpansion
set "ULTIMO_ERRO="
call :CheckGit || goto :Falha
call :CheckPHP || goto :Falha
call :CheckExt || goto :Falha
call :CheckMySQL || goto :Falha
call :SetupRepo || goto :Falha
call :StartMySQL || goto :Falha
call :ImportDB || goto :Falha
call :SetupEnv || goto :Falha
call :CheckVendor || goto :Falha
call :CheckPorta || goto :Falha
call :StartServer || goto :Falha
goto :eof

:SetupRepo
    if not exist "%USERPROFILE%\Documents" (
        mkdir "%USERPROFILE%\Documents"
    )
    cd "%USERPROFILE%\Documents"
    if not exist "%USERPROFILE%\Documents\PetAlliance" (
        git clone https://github.com/ThurStelzner/PetAlliance.git
        if errorlevel 1 (
            call :TrataErros "Não foi possivel clonar repositorio."
            exit /b 1
        )
    )
    exit /b 0

:StartMySQL
    cd C:\xampp\mysql\bin
    if errorlevel 1 (
        call :TrataErros "Pasta C:\xampp\mysql\bin não encontrada."
        exit /b 1
    )
    start /b mysqld
    timeout 5 /nobreak >nul
    if errorlevel 1 (
        call :TrataErros "Não foi possivel iniciar mySql"
        exit /b 1
    )
    exit /b 0

:ImportDB
    set "banco=%USERPROFILE%\Documents\PetAlliance\docs\banco.sql"
    if not exist "!banco!" (
        call :TrataErros "banco.sql nao encontrado em !banco!"
        exit /b 1
    )
    mysql.exe -u root -N -e "SHOW TABLES FROM pet_alliance_db LIKE 'tb_usuarios';" 2>nul | findstr /I "tb_usuarios" >nul 2>&1
    if not errorlevel 1 (
        echo [OK] Banco ja importado, pulando.
        exit /b 0
    )
    mysql.exe -u root -P 3306 < "!banco!"
    if errorlevel 1 (
        call :TrataErros "Nao foi possivel importar banco"
        exit /b 1
    )
    exit /b 0

:SetupEnv
    cd "%USERPROFILE%\Documents\PetAlliance\"
    (
        echo DB_SENHA=
        echo DB_NAME=pet_alliance_db
        echo DB_USER=root
        echo DB_HOST=127.0.0.1

        echo ABACATEPAY_API_KEY=
        echo ABACATEPAY_URL=
        echo ABACATEPAY_PRODUCT_ID=
        echo ABACATEPAY_PRODUCT2_ID=
        echo ABACATEPAY_PRODUCT3_ID=
        echo ABACATEPAY_PRODUCT4_ID=

        echo SMTP_HOST=smtp.gmail.com
        echo SMTP_PORT=587
        echo SMTP_USER=PetAllianceofc@gmail.com
        echo SMTP_PASS=ihkl xccx kxbb awvp
        echo SMTP_FROM_EMAIL=PetAllianceofc@gmail.com
        echo SMTP_FROM_NAME=PetAlliance
    ) > .env
    if errorlevel 1 (
        call :TrataErros "Não foi possivel criar .env"
        exit /b 1
    )
    exit /b 0

:StartServer
    cd "%USERPROFILE%\Documents\PetAlliance\"
    echo Iniciando Local Host
    start "" /MAX http://localhost:9090

    echo Importacao finalizada.
    C:\xampp\php\php.exe -S localhost:9090
    if errorlevel 1 (
        call :TrataErros "Não foi possivel iniciar servidor"
        exit /b 1
    )
    exit /b 0

:CheckGit
    where git >nul 2>&1
    if not errorlevel 1 exit /b 0
    winget install Git.Git -e --silent --accept-package-agreements >nul 2>&1
    where git >nul 2>&1
    if not errorlevel 1 exit /b 0
    start "" "https://git-scm.com/downloads"
    call :TrataErros "Git ausente - instalador aberto"
    exit /b 1

:TrataErros
    set "ULTIMO_ERRO=%~1"
    echo   [ERRO] %~1
    echo [%date% %time%] ERRO: %~1 >> "%USERPROFILE%\Documents\PetAlliance\importacao.log"
    exit /b 1

:CheckPHP
    where php >nul 2>&1
    if errorlevel 1 (
        winget install PHP.PHP.8.4 -e --silent --accept-package-agreements >nul 2>&1
        where php >nul 2>&1
        if errorlevel 1 (
            start "" "https://windows.php.net/download/"
            call :TrataErros "PHP ausente - instalador aberto"
            exit /b 1
        )
    )
    for /f "delims=" %%v in ('php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;"') do set "PHPVER=%%v"
    for /f "tokens=1,2 delims=." %%a in ("!PHPVER!") do set /a "PHPNUM=%%a*100+%%b"
    if !PHPNUM! LSS 803 (
        echo [AVISO] PHP !PHPVER! antigo (XAMPP e 8.2). Coloque C:\Senai\php-8.4.5 antes no PATH.
        call :TrataErros "PHP !PHPVER! precisa 8.3+"
        exit /b 1
    )
    php --ini | findstr /I "(none)" >nul 2>&1
    if not errorlevel 1 (
        echo Resolvendo: copiando php.ini-development...
        for /f "delims=" %%p in ('where php') do set "PHPPASTA=%%~dpp"
        copy "!PHPPASTA!php.ini-development" "!PHPPASTA!php.ini" >nul 2>&1
        echo Edite !PHPPASTA!php.ini: extension_dir absoluto + descomente pdo_mysql mysqli curl openssl mbstring gd fileinfo
        call :TrataErros "php.ini ausente - criado modelo, configure e rode de novo"
        exit /b 1
    )
    exit /b 0

:CheckExt
    set "FALTA="
    for %%e in (pdo_mysql mysqli curl openssl mbstring gd fileinfo) do (
        php -m 2>nul | findstr /I /X "%%e" >nul 2>&1
        if errorlevel 1 set "FALTA=!FALTA! %%e"
    )
    if defined FALTA (
        echo Faltando:!FALTA! - No php.ini descomente extension=!FALTA!
        call :TrataErros "Extensoes faltando:!FALTA!"
        exit /b 1
    )
    exit /b 0

:CheckMySQL
    if not exist "C:\xampp\mysql\bin\mysql.exe" (
        winget install ApacheFriends.Xampp.8.2 -e --silent >nul 2>&1
        if not exist "C:\xampp\mysql\bin\mysql.exe" (
            start "" "https://www.apachefriends.org/download.html"
            call :TrataErros "XAMPP ausente - instalador aberto"
            exit /b 1
        )
    )
    "C:\xampp\mysql\bin\mysql.exe" --version
    exit /b 0

:CheckVendor
    if exist "vendor\autoload.php" exit /b 0
    git checkout -- vendor >nul 2>&1
    if exist "vendor\autoload.php" exit /b 0
    where composer >nul 2>&1
    if not errorlevel 1 (
        composer install
        if exist "vendor\autoload.php" exit /b 0
    )
    call :TrataErros "PHPMailer ausente - rode composer install"
    exit /b 1

:CheckPorta
    netstat -ano | findstr ":9090 .*LISTENING" >nul 2>&1
    if not errorlevel 1 (
        call :TrataErros "Porta 9090 ocupada - use php -S localhost:8080"
        exit /b 1
    )
    exit /b 0

:Falha
    echo ----------------------------------------
    echo [FALHA] !ULTIMO_ERRO!
    echo Log completo: "%USERPROFILE%\Documents\PetAlliance\importacao.log"
    echo ----------------------------------------
    if exist "%USERPROFILE%\Documents\PetAlliance\importacao.log" (
        type "%USERPROFILE%\Documents\PetAlliance\importacao.log"
    ) else (
        echo ^(sem log gerado^)
    )
    pause
    exit /b 1
