@echo off
cd /d "%~dp0"
chcp 65001 >nul

echo ============================================================
echo   Deploy: chengzhu-CARS (Cloudflare Workers + D1)
echo ============================================================
echo.

echo [1/3] Apply D1 migrations to REMOTE (skips already-applied)
call npx wrangler d1 migrations apply chengzhu-cars --remote <nul
if errorlevel 1 (
    echo.
    echo ERROR: D1 migrations failed. Check wrangler auth + DB config.
    pause
    exit /b 1
)
echo.

echo [2/3] Deploy Worker to Cloudflare
call npx wrangler deploy
if errorlevel 1 (
    echo.
    echo ERROR: wrangler deploy failed.
    pause
    exit /b 1
)
echo.

echo [3/3] Show service URL
echo.
echo   ✅ Deploy done
echo   URL: https://chengzhu-cars.kuo-tinghow.workers.dev
echo.

echo ============================================================
echo   All done
echo ============================================================
pause
