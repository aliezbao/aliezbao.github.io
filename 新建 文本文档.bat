@echo off
chcp 65001 >nul
set "root=apple-style-blog"

echo 正在创建 %root% 项目结构...

:: 创建根目录
mkdir "%root%"

:: 1. 创建 .github\workflows 目录及 deploy.yml
mkdir "%root%\.github\workflows"
type nul > "%root%\.github\workflows\deploy.yml"

:: 2. 创建 posts 目录及文章文件
mkdir "%root%\posts"
type nul > "%root%\posts\welcome.md"
type nul > "%root%\posts\react-hooks.md"
type nul > "%root%\posts\apple-design.md"

:: 3. 创建 src\app 目录结构
mkdir "%root%\src\app\api"
type nul > "%root%\src\app\globals.css"
type nul > "%root%\src\app\layout.tsx"
type nul > "%root%\src\app\page.tsx"

:: 4. 创建 src\lib\blog 目录及 index.ts
mkdir "%root%\src\lib\blog"
type nul > "%root%\src\lib\blog\index.ts"

:: 5. 创建根目录 README.md
type nul > "%root%\README.md"

echo.
echo 项目结构创建完成！请查看 %root% 文件夹。
pause
