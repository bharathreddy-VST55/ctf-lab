@echo off
REM =============================================================================
REM  VulnLab – Reset Script (Windows CMD / PowerShell)
REM  INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
REM
REM  Usage: reset.bat [hard]
REM    hard  : stops, removes containers/images/volumes, rebuilds from scratch
REM    (no arg): just restarts the running container
REM =============================================================================

cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════════════════════╗
echo ║   VulnLab Reset Tool                                ║
echo ║   INTENTIONALLY VULNERABLE – EDUCATIONAL USE ONLY  ║
echo ╚══════════════════════════════════════════════════════╝
echo.

IF "%1"=="hard" (
    echo [*] HARD RESET – stopping and removing all containers, images, volumes...
    docker compose -f docker-compose.yml down --rmi local --volumes --remove-orphans
    echo [*] Rebuilding from scratch...
    docker compose -f docker-compose.yml build --no-cache
    echo [*] Starting lab...
    docker compose -f docker-compose.yml up -d
    echo.
    echo [OK] Hard reset complete. Lab is running at: http://127.0.0.1:8080
) ELSE (
    echo [*] SOFT RESET – restarting container ^(in-memory state cleared^)...
    docker compose -f docker-compose.yml restart vulnlab
    echo.
    echo [OK] Restart complete. Lab is running at: http://127.0.0.1:8080
)

echo.
echo [*] Container status:
docker compose -f docker-compose.yml ps
