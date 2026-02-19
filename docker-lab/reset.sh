#!/usr/bin/env bash
# =============================================================================
#  VulnLab – Reset Script (Linux/macOS/WSL)
#  INTENTIONALLY VULNERABLE – FOR EDUCATIONAL USE ONLY
#
#  Usage: bash reset.sh [--hard]
#    --hard  : stops, removes containers/images/volumes, rebuilds from scratch
#    (no arg): just restarts the running container
# =============================================================================

set -e
cd "$(dirname "$0")"

COMPOSE_FILE="docker-compose.yml"
SERVICE="vulnlab"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║   VulnLab Reset Tool                                ║"
echo "║   INTENTIONALLY VULNERABLE – EDUCATIONAL USE ONLY  ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""

if [[ "$1" == "--hard" ]]; then
  echo "[*] HARD RESET – stopping and removing all containers, images, volumes..."
  docker compose -f "$COMPOSE_FILE" down --rmi local --volumes --remove-orphans
  echo "[*] Rebuilding from scratch..."
  docker compose -f "$COMPOSE_FILE" build --no-cache
  echo "[*] Starting lab..."
  docker compose -f "$COMPOSE_FILE" up -d
  echo ""
  echo "[✓] Hard reset complete. Lab is running at: http://127.0.0.1:8080"
else
  echo "[*] SOFT RESET – restarting container (in-memory state cleared)..."
  docker compose -f "$COMPOSE_FILE" restart "$SERVICE"
  echo ""
  echo "[✓] Restart complete. Lab is running at: http://127.0.0.1:8080"
fi

echo ""
echo "[*] Container status:"
docker compose -f "$COMPOSE_FILE" ps
