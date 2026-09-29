@echo off
echo ========================================================
echo   Pusheando todas las ramas a GitHub (MarcoAAguil4r)
echo ========================================================
git push -u origin --all
echo.
echo ========================================================
echo   Pusheando tags (si existen)
echo ========================================================
git push origin --tags
echo.
echo Proceso finalizado con exito.
pause
