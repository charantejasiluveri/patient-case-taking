@echo off
echo =========================================
echo MEDIEASE - STARTUP SCRIPT
echo =========================================
echo Starting Backend Server...
start "Mediease Backend" cmd /c "uvicorn backend.main:app --port 8000 --reload"

echo Starting Frontend Server...
start "Mediease Frontend" cmd /c "cd frontend && python -m http.server 5500"

echo.
echo Mediease is now running!
echo -----------------------------------------
echo [FRONTEND] Open your browser to:
echo http://127.0.0.1:5500
echo.
echo [BACKEND API] Swagger UI:
echo http://127.0.0.1:8000/docs
echo -----------------------------------------
echo To stop the servers, close the two command prompt windows that just opened.
echo Or run stop.bat
echo =========================================
pause
