@echo off
title AuraHealth EHR - Development Mode (Vite + Node)
echo ========================================================
echo   Starting Backend API (Port 5000) & Vite Dev (Port 3000)
echo ========================================================
echo.
start "AuraHealth API" cmd /k "cd /d "%~dp0\server" && npm run dev"
timeout /t 2 /nobreak >nul
start "AuraHealth Client Vite" cmd /k "cd /d "%~dp0\client" && npm run dev"
timeout /t 3 /nobreak >nul
start http://localhost:3000
