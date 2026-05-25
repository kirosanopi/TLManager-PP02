@echo off
echo.
echo [checking dependencies...]
echo.

if not exist "backend\node_modules" (
    echo [Installing backend dependencies...]
    cd backend
    call npm install
    cd ..
    echo [Backend dependencies installed!]
    echo.
)

if not exist "frontend\node_modules" (
    echo [Installing frontend dependencies...]
    cd frontend
    call npm install
    cd ..
    echo [Frontend dependencies installed!]
    echo.
)

echo [starting application...]
echo.

start "Backend" cmd /k "cd backend && npm start"

timeout /t 2 /nobreak >nul

start "Frontend" cmd /k "cd frontend && npm start"

echo [Servers are running!]
echo [Backend: http://localhost:3000]
echo [Frontend: http://localhost:3001]