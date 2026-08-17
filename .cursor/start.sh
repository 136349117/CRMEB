#!/usr/bin/env bash
# Per-boot services for CRMEB: MariaDB, Redis, database seed.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CRMEB="${ROOT}/crmeb"
SQL_FILE="${CRMEB}/public/install/crmeb.sql"
LOCK_FILE="${CRMEB}/public/install.lock"

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=()
else
  SUDO=(sudo -E)
fi

log() { printf '[start] %s\n' "$*"; }

write_env() {
  bash "${ROOT}/.cursor/write-env.sh"
}

mysql_ready() {
  "${SUDO[@]}" mysqladmin ping --protocol=socket >/dev/null 2>&1 \
    || "${SUDO[@]}" mysqladmin ping -h 127.0.0.1 -uroot --skip-password >/dev/null 2>&1 \
    || mysql -h 127.0.0.1 -ucrmeb -pcrmeb -e "SELECT 1" >/dev/null 2>&1
}

mysql_root() {
  if "${SUDO[@]}" mysql --protocol=socket -uroot -e "SELECT 1" >/dev/null 2>&1; then
    "${SUDO[@]}" mysql --protocol=socket -uroot "$@"
  elif "${SUDO[@]}" mysql -h 127.0.0.1 -uroot --skip-password -e "SELECT 1" >/dev/null 2>&1; then
    "${SUDO[@]}" mysql -h 127.0.0.1 -uroot --skip-password "$@"
  else
    "${SUDO[@]}" mysql -h 127.0.0.1 -uroot "$@"
  fi
}

start_mysql() {
  if mysql_ready; then
    log "MariaDB already running"
    return
  fi

  if [[ ! -d /var/lib/mysql/mysql ]]; then
    log "Initializing MariaDB datadir"
    if command -v mariadb-install-db >/dev/null 2>&1; then
      "${SUDO[@]}" mariadb-install-db --user=mysql --datadir=/var/lib/mysql >/tmp/mariadb-install.log 2>&1
    else
      "${SUDO[@]}" mysql_install_db --user=mysql --datadir=/var/lib/mysql >/tmp/mariadb-install.log 2>&1
    fi
  fi

  "${SUDO[@]}" mkdir -p /var/run/mysqld /var/log/mysql
  "${SUDO[@]}" chown mysql:mysql /var/run/mysqld /var/lib/mysql /var/log/mysql || true

  log "Starting MariaDB"
  if command -v mysqld_safe >/dev/null 2>&1; then
    "${SUDO[@]}" mysqld_safe --datadir=/var/lib/mysql --pid-file=/var/run/mysqld/mysqld.pid >/tmp/mariadb.log 2>&1 &
  else
    "${SUDO[@]}" /usr/sbin/mariadbd --user=mysql --datadir=/var/lib/mysql --pid-file=/var/run/mysqld/mysqld.pid >/tmp/mariadb.log 2>&1 &
  fi

  for _ in $(seq 1 60); do
    if mysql_ready; then
      log "MariaDB is ready"
      return
    fi
    sleep 1
  done
  log "MariaDB failed to start; last log lines:"
  tail -n 50 /tmp/mariadb.log /tmp/mariadb-install.log 2>/dev/null || true
  exit 1
}

start_redis() {
  if redis-cli ping >/dev/null 2>&1; then
    log "Redis already running"
    return
  fi
  log "Starting Redis"
  "${SUDO[@]}" redis-server --daemonize yes --bind 127.0.0.1 --protected-mode yes --port 6379
  for _ in $(seq 1 20); do
    if redis-cli ping >/dev/null 2>&1; then
      log "Redis is ready"
      return
    fi
    sleep 0.5
  done
  log "Redis failed to start"
  exit 1
}

ensure_database() {
  log "Ensuring crmeb database and user"
  mysql_root <<'SQL'
SET GLOBAL sql_mode='NO_ENGINE_SUBSTITUTION';
CREATE DATABASE IF NOT EXISTS crmeb DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'crmeb'@'127.0.0.1' IDENTIFIED BY 'crmeb';
CREATE USER IF NOT EXISTS 'crmeb'@'localhost' IDENTIFIED BY 'crmeb';
GRANT ALL PRIVILEGES ON crmeb.* TO 'crmeb'@'127.0.0.1';
GRANT ALL PRIVILEGES ON crmeb.* TO 'crmeb'@'localhost';
FLUSH PRIVILEGES;
SQL

  local table_count
  table_count="$(mysql -h 127.0.0.1 -ucrmeb -pcrmeb crmeb -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='crmeb';" 2>/dev/null || echo 0)"
  if [[ "${table_count}" -lt 10 ]]; then
    log "Importing ${SQL_FILE}"
    mysql -h 127.0.0.1 -ucrmeb -pcrmeb crmeb <"${SQL_FILE}"
  else
    log "Database already imported (${table_count} tables)"
  fi

  local admin_hash
  admin_hash="$(php -r 'echo password_hash("crmeb.com", PASSWORD_BCRYPT);')"
  mysql -h 127.0.0.1 -ucrmeb -pcrmeb crmeb -e "UPDATE eb_system_admin SET pwd='${admin_hash}', status=1, is_del=0 WHERE account='admin' LIMIT 1;"
  mysql -h 127.0.0.1 -ucrmeb -pcrmeb crmeb -e "UPDATE eb_system_config SET value='\"http://127.0.0.1:8000\"' WHERE menu_name='site_url' LIMIT 1;" || true
}

write_lock() {
  if [[ ! -f "${LOCK_FILE}" ]]; then
    date >"${LOCK_FILE}"
  fi
  if [[ ! -f "${CRMEB}/.constant" ]]; then
    cat >"${CRMEB}/.constant" <<EOF
<?php
define('INSTALL_DATE',$(date +%s));
define('SERIALNUMBER','dev001');
EOF
  fi
}

start_mysql
start_redis
write_env
ensure_database
write_lock
log "Start complete"
