@echo off

cd "%USERPROFILE%\Documents"

git clone https://github.com/ThurStelzner/PetAlliance.git

cd C:\xampp\mysql\bin

start mysqld

timeout 4 /nobreak >nul 

set banco="%USERPROFILE%\Documents\PetAlliance\docs\banco.sql"

mysql.exe -u root -P 3306 < %banco%

cd "%USERPROFILE%\Documents\PetAlliance\" 

echo DB_SENHA= >> .env
echo DB_NAME=pet_alliance_db >> .env
echo DB_USER=root >> .env
echo DB_HOST=127.0.0.1:3306 >> .env
echo ABACATEPAY_API_KEY= >> .env
echo ABACATEPAY_URL= >> .env
echo ABACATEPAY_PRODUCT_ID= >> .env
echo ABACATEPAY_PRODUCT2_ID= >> .env
echo ABACATEPAY_PRODUCT3_ID= >> .env
echo ABACATEPAY_PRODUCT4_ID= >> .env
echo SMTP_HOST= >> .env
echo SMTP_PORT= >> .env
echo SMTP_USER= >> .env
echo SMTP_PASS= >> .env
echo SMTP_FROM_EMAIL= >> .env
echo SMTP_FROM_NAME= >> .env

cd "%USERPROFILE%\Documents\PetAlliance\"

echo Iniciando Local Host
start "" /MAX https:localhost:9090
php -S localhost:9090

echo Importacao finalizada.
timeout 5