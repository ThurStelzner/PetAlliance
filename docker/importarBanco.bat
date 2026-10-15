@echo off
REM Importa docs\banco.sql para o MySQL do compose (db ja precisa estar no ar).
echo Aguardando MySQL responder (30s)...
timeout /t 30 /nobreak >nul
docker exec -i petalliance-db mysql -uroot -proot pet_alliance_db < docs\banco.sql
if %errorlevel%==0 (
    echo [OK] Banco importado.
) else (
    echo [AVISO] Falha no import. Confira se o container petalliance-db esta rodando.
)
docker exec petalliance-db mysql -uroot -proot pet_alliance_db -e "SHOW TABLES;"
pause
