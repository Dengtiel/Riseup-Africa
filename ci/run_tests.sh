#!/usr/bin/env bash
set -euo pipefail

# CI-friendly test runner for the project.
# What it does:
# - removes project-level uploads/ and backend/data.db before running tests
# - creates an isolated virtualenv, installs backend requirements, runs pytest
# - always cleans uploads/ and backend/data.db after the run (success or failure)

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV_DIR="$ROOT/.venv_ci"

cleanup() {
  echo "Cleaning artifacts..."
  rm -rf "$ROOT/uploads" "$ROOT/backend/data.db" "$VENV_DIR"
}

trap cleanup EXIT

echo "Preparing clean test environment..."
rm -rf "$ROOT/uploads" "$ROOT/backend/data.db"

PYTHON=${PYTHON:-python3}
echo "Creating virtualenv using: ${PYTHON}"
$PYTHON -m venv "$VENV_DIR"
if [ -f "$VENV_DIR/bin/activate" ]; then
  # POSIX
  # shellcheck disable=SC1091
  source "$VENV_DIR/bin/activate"
elif [ -f "$VENV_DIR/Scripts/activate" ]; then
  # Windows Git Bash or similar
  # shellcheck disable=SC1091
  source "$VENV_DIR/Scripts/activate"
fi

pip install --upgrade pip
pip install -r "$ROOT/backend/requirements.txt"

echo "Running pytest..."
set +e
pytest -q
RC=$?
set -e

if [ $RC -ne 0 ]; then
  echo "Tests failed with exit code $RC"
  exit $RC
fi

echo "Tests passed"
exit 0
