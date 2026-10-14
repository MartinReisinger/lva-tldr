#!/bin/sh
set -eu

# Never initialize a replacement database when the production mount is missing.
database_path=${NUXT_QUIZ_DATABASE_PATH:-/app/.data/quiz-progress.sqlite}
if [ ! -f "$database_path" ] || [ ! -s "$database_path" ]; then
  echo "Existing database unavailable: $database_path; check persistent storage." >&2
  exit 1
fi

exec "$@"
