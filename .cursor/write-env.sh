#!/usr/bin/env bash
# Local CRMEB .env. Tracked crmeb/.env is an empty template and git checkout
# restores it after snapshot/start, so this must also run after checkout.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CRMEB="${ROOT}/crmeb"

cat >"${CRMEB}/.env" <<'EOF'
APP_DEBUG = true

[APP]
DEFAULT_TIMEZONE = Asia/Shanghai

[DATABASE]
TYPE = mysql
HOSTNAME = 127.0.0.1
HOSTPORT = 3306
USERNAME = crmeb
PASSWORD = 'crmeb'
DATABASE = crmeb
PREFIX = eb_
CHARSET = utf8
DEBUG = true

[LANG]
default_lang = zh-cn

[REDIS]
REDIS_HOSTNAME = 127.0.0.1
PORT = 6379
REDIS_PASSWORD =
SELECT = 0

[QUEUE]
QUEUE_NAME = crmeb
EOF
