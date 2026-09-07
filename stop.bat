@echo off
echo =========================================
echo MEDIEASE - SHUTDOWN SCRIPT
echo =========================================
echo Stopping FastAPI (Backend)...
taskkill /F /IM uvicorn.exe /T >nul 2>&1

echo Stopping Python HTTP Server (Frontend)...
:: This kills python processes running the http server. 
:: We use WMIC to find the exact python process running http.server
wmic process where "commandline like '%%http.server 5500%%'" call terminate >nul 2>&1

echo Mediease servers have been stopped.
echo =========================================
pause
