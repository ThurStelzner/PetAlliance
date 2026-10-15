@echo off
REM Para os containers sem apagar nada.
cd /d "%~dp0.."
docker compose stop
pause
