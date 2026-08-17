#!/usr/bin/env bash
# Rewrite .env after checkout, then serve CRMEB.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
bash "${ROOT}/.cursor/write-env.sh"
cd "${ROOT}/crmeb"
exec php think run -H 0.0.0.0 -p 8000
