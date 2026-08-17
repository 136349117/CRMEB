#!/usr/bin/env bash
# Start REBUILD community edition. Docker Engine keeps the containers running.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

if ! command -v docker >/dev/null 2>&1; then
  bash "$ROOT/install.sh"
fi

sudo service docker start >/dev/null 2>&1 || true
if ! docker info >/dev/null 2>&1; then
  export DOCKER_HOST="${DOCKER_HOST:-tcp://127.0.0.1:2375}"
fi

docker compose -f "$ROOT/docker-compose.yml" up -d

echo "Waiting for http://127.0.0.1:18080/ ..."
for _ in $(seq 1 60); do
  if curl -fsS --max-time 3 http://127.0.0.1:18080/user/login >/dev/null 2>&1; then
    echo "REBUILD community edition is up: http://127.0.0.1:18080/"
    echo "Login: admin / admin"
    exit 0
  fi
  sleep 2
done

echo "REBUILD containers started, but the HTTP port is not ready yet. Check: docker compose -f $ROOT/docker-compose.yml logs"
exit 0
