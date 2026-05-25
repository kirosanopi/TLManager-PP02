@echo off
echo.
echo [starting application...]
echo.

start "Backend" cmd /k "cd backend && npm start"

timeout /t 2 /nobreak >nul

start "Frontend" cmd /k "cd frontend && npm start"

echo [Servers are running!]
echo [Backend: http://localhost:3000]
echo [Frontend: http://localhost:3001]