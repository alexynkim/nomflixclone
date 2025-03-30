@echo off
cd /d %~dp0
set /p commitMessage="Enter commit message: "

:: Check current branch
for /f "tokens=*" %%i in ('git rev-parse --abbrev-ref HEAD') do set branchName=%%i

:: Display current branch
echo Current Branch: %branchName%
echo Commit messages: %commitMessage%
pause

echo.
echo 🔄 Staging files...
git add .

echo.
echo 📝 Committing changes...
git commit -m "%commitMessage%"

echo.
echo 🚀 Pushing to remote repository (Branch: %branchName%)...
git push origin %branchName%

echo.
echo ✅ Git process completed!
pause