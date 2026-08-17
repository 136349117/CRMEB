#!/usr/bin/env bash
# Idempotent bootstrap for REBUILD community edition on a Cursor Cloud Agent.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"

ensure_docker() {
  if ! command -v docker >/dev/null 2>&1; then
    local tmp
    tmp="$(mktemp -d)"
    curl -fsSL -o "$tmp/docker.tgz" https://download.docker.com/linux/static/stable/x86_64/docker-29.1.4.tgz
    tar -xzf "$tmp/docker.tgz" -C "$tmp"
    if [ -w /usr/local/bin ]; then
      cp "$tmp/docker/docker" /usr/local/bin/docker
      chmod +x /usr/local/bin/docker
    else
      sudo cp "$tmp/docker/docker" /usr/local/bin/docker
      sudo chmod +x /usr/local/bin/docker
    fi
    rm -rf "$tmp"
  fi

  local dest="${DOCKER_CONFIG:-$HOME/.docker}/cli-plugins/docker-compose"
  if ! docker compose version >/dev/null 2>&1; then
    mkdir -p "$(dirname "$dest")"
    curl -fsSL -o "$dest" https://github.com/docker/compose/releases/download/v2.32.4/docker-compose-linux-x86_64
    chmod +x "$dest"
  fi

  sudo service docker start >/dev/null 2>&1 || true
  if docker info >/dev/null 2>&1; then
    return 0
  fi
  export DOCKER_HOST="${DOCKER_HOST:-tcp://127.0.0.1:2375}"
  docker info >/dev/null
}

ensure_docker
docker compose -f "$ROOT/docker-compose.yml" pull
echo "REBUILD images are ready."
