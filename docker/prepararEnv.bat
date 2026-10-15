@echo off
REM Cria o .env a partir do modelo (o .env real nao vai pro git por seguranca).
cd /d "%~dp0.."
if not exist ".env" (
    copy /Y ".env.exemple" ".env" >nul
    echo [OK] .env criado a partir do .env.exemple. Preencha as chaves se precisar.
) else (
    echo [OK] .env ja existe.
)
pause
