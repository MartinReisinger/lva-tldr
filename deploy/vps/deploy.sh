#!/bin/sh
set -eu
cd /home/deploy/lva-tldr
test -s .env
# Current images require an existing quiz database. Never create an empty replacement.
docker volume inspect lva-tldr_quiz-data > /dev/null
docker run --rm --network none --entrypoint sh \
  -v lva-tldr_quiz-data:/data:ro alpine:3.24 \
  -c 'test -s /data/quiz-progress.sqlite'
docker compose --env-file .env -f compose.pending.yml config -q
install -m 0644 compose.pending.yml compose.yml
docker compose pull
docker compose up -d --wait --wait-timeout 120
docker compose ps
