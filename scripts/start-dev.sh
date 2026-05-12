#!/usr/bin/env bash
# Start backend and frontend for Unix-like systems
# Usage: ./scripts/start-dev.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"
BACKEND_DIR="${PROJECT_ROOT}/backend"
FRONTEND_DIR="${PROJECT_ROOT}/frontend"

backend_port=8000
frontend_port=3000

is_port_in_use() {
	local port="$1"
	if command -v lsof >/dev/null 2>&1; then
		lsof -iTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1
	else
		ss -ltn "sport = :${port}" 2>/dev/null | grep -q LISTEN
	fi
}

if [ ! -x "${BACKEND_DIR}/venv/bin/python" ]; then
	echo "Backend virtual environment not found at backend/venv/bin/python"
	exit 1
fi

if is_port_in_use "${backend_port}"; then
	echo "Backend port ${backend_port} is already in use. Reusing existing backend."
else
	(cd "${BACKEND_DIR}" && ./venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port "${backend_port}" --reload) &
	BACKEND_PID=$!
fi

if is_port_in_use "${frontend_port}"; then
	echo "Frontend port ${frontend_port} is already in use. Starting on 5173 instead."
	frontend_port=5173
fi

(cd "${FRONTEND_DIR}" && npm run dev -- --host 127.0.0.1 --port "${frontend_port}") &
FRONTEND_PID=$!

echo "Started frontend on http://127.0.0.1:${frontend_port} (pid=${FRONTEND_PID})."
if [ -n "${BACKEND_PID:-}" ]; then
	echo "Started backend on http://127.0.0.1:${backend_port} (pid=${BACKEND_PID})."
fi

wait
