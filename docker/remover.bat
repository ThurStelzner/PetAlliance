@echo off
REM Limpeza total: containers + imagens do compose + volumes + orfaos (era isso que gerava os 20 GB).
cd /d "%~dp0.."
docker compose down --rmi all -v --remove-orphans
docker system prune -f
docker system df
pause
