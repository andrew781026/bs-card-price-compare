#!/usr/bin/env sh
set -eu

# 使用 envsubst 來指定特定的環境變數做文字替換
envsubst '${TASKS_API_URL}' < /etc/nginx/conf.d/nginx.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
