@echo off
title AuraHealth EHR v2.0 - Electronic Health Record Platform
echo ========================================================
echo   Starting AuraHealth EHR System (Unified Full-Stack)
echo   Connected Clinical Intelligence & Patient Portal
echo ========================================================
echo.
cd /d "%~dp0\server"
start http://localhost:5000
npm start
pause
