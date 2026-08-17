#!/usr/bin/env bash
# Idempotent Cloud Agent install for CRMEB (PHP 7.4 + MariaDB + Redis).
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CRMEB="${ROOT}/crmeb"

if [[ "${EUID}" -eq 0 ]]; then
  SUDO=()
else
  SUDO=(sudo -E)
fi

log() { printf '[install] %s\n' "$*"; }

need_php74() {
  if command -v php >/dev/null 2>&1; then
    php -r 'exit(version_compare(PHP_VERSION, "7.1.0", ">=") && version_compare(PHP_VERSION, "8.0.0", "<") ? 0 : 1);'
  else
    return 1
  fi
}

install_system_packages() {
  local packages=()
  command -v curl >/dev/null 2>&1 || packages+=(curl ca-certificates)
  command -v git >/dev/null 2>&1 || packages+=(git)
  command -v unzip >/dev/null 2>&1 || packages+=(unzip)
  dpkg -s gnupg >/dev/null 2>&1 || packages+=(gnupg)
  dpkg -s software-properties-common >/dev/null 2>&1 || packages+=(software-properties-common)
  dpkg -s mariadb-server >/dev/null 2>&1 || packages+=(mariadb-server mariadb-client)
  dpkg -s redis-server >/dev/null 2>&1 || packages+=(redis-server)

  if ((${#packages[@]})); then
    log "Installing base packages: ${packages[*]}"
    "${SUDO[@]}" mkdir -p /var/lib/apt/lists/partial
    "${SUDO[@]}" apt-get update -y
    "${SUDO[@]}" apt-get install -y --no-install-recommends "${packages[@]}"
  fi

  if ! need_php74; then
    log "Installing PHP 7.4 from ondrej/php"
    "${SUDO[@]}" mkdir -p /var/lib/apt/lists/partial
    "${SUDO[@]}" apt-get update -y
    "${SUDO[@]}" apt-get install -y --no-install-recommends software-properties-common gnupg
    "${SUDO[@]}" add-apt-repository -y ppa:ondrej/php
    "${SUDO[@]}" apt-get update -y
    "${SUDO[@]}" apt-get install -y --no-install-recommends \
      php7.4-cli \
      php7.4-common \
      php7.4-mysql \
      php7.4-redis \
      php7.4-gd \
      php7.4-bcmath \
      php7.4-mbstring \
      php7.4-xml \
      php7.4-curl \
      php7.4-zip \
      php7.4-opcache \
      php7.4-intl
    if command -v update-alternatives >/dev/null 2>&1 && [[ -x /usr/bin/php7.4 ]]; then
      "${SUDO[@]}" update-alternatives --set php /usr/bin/php7.4 >/dev/null 2>&1 || true
    fi
  fi

  if ! command -v composer >/dev/null 2>&1; then
    log "Installing Composer"
    php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
    "${SUDO[@]}" php composer-setup.php --install-dir=/usr/local/bin --filename=composer --quiet
    rm -f composer-setup.php
  fi
}

write_mysql_config() {
  "${SUDO[@]}" mkdir -p /etc/mysql/conf.d
  "${SUDO[@]}" tee /etc/mysql/conf.d/crmeb.cnf >/dev/null <<'EOF'
[mysqld]
bind-address = 127.0.0.1
sql_mode = NO_ENGINE_SUBSTITUTION
character-set-server = utf8mb4
collation-server = utf8mb4_general_ci
skip-name-resolve
EOF
}

write_env() {
  bash "${ROOT}/.cursor/write-env.sh"
}

prepare_app_dirs() {
  mkdir -p "${CRMEB}/runtime" "${CRMEB}/public/uploads"
  chmod -R ugo+rwX "${CRMEB}/runtime" "${CRMEB}/public/uploads" || true
  chmod ugo+rw "${CRMEB}/.env" || true
}

install_system_packages
write_mysql_config
write_env
prepare_app_dirs

if [[ ! -f "${CRMEB}/vendor/autoload.php" ]]; then
  log "Running composer install"
  (cd "${CRMEB}" && composer install --no-dev --no-interaction --prefer-dist)
else
  log "vendor/ already present; skipping composer install"
fi

php -v
php -m | grep -Ei 'mysqli|redis|gd|bcmath|mbstring|curl|openssl|fileinfo|zip' || true
log "Install complete"
