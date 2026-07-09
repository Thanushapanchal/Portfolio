@echo off
cd /d "%~dp0"
echo Pushing your website to GitHub...
echo A browser window will open for you to sign in to GitHub. Please complete it.
echo.
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo ============================================
echo If you see "main -^> main" above, it worked!
echo ============================================
pause
