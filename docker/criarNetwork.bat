@echo off
REM Cria a network petNetwork (mesma do docker-compose.yml). Idempotente.
docker network ls | findstr petNetwork >nul
if %errorlevel%==0 (
    echo [OK] Network petNetwork ja existe.
) else (
    docker network create petNetwork
    echo [OK] Network petNetwork criada.
)
pause
