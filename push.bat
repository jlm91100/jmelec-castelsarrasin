@echo off
cd /d "%~dp0"
del /f /q ".git\index.lock" 2>nul
git add .
git commit -m "Vrais logos PNG + favicon"
git push origin master
echo.
echo === TERMINE ===
pause
