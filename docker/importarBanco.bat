@echo off
REM Importa docs\banco.sql para o MySQL do compose (db ja precisa estar no ar).
cd /d "%~dp0.."

set "BANCO=%~dp0..\docs\banco.sql"
if not exist "%BANCO%" (
    echo [ERRO] Arquivo nao encontrado: %BANCO%
    pause
    exit /b 1
)

echo Aguardando MySQL responder (30s)...
timeout /t 30 /nobreak >nul

docker exec -i petalliance-db mysql -uroot -proot pet_alliance_db < "%BANCO%"
if errorlevel 1 (
    echo [AVISO] Falha no import. Confira se o container petalliance-db esta rodando.
    pause
    exit /b 1
)

echo [OK] Banco importado.
docker exec petalliance-db mysql -uroot -proot pet_alliance_db -e "SHOW TABLES;"
pause
