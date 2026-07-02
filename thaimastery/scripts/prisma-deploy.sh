#!/usr/bin/env bash
# Sync the Prisma schema to the database during build, but only when a
# DATABASE_URL is configured (so static/dry builds still work without a DB).
set -euo pipefail

if [ -z "${DATABASE_URL:-}" ]; then
  echo "prisma-deploy: DATABASE_URL not set — skipping db push."
  exit 0
fi

echo "prisma-deploy: pushing schema to database…"
npx prisma db push --accept-data-loss --skip-generate
echo "prisma-deploy: done."
