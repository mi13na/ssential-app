#!/bin/zsh
# Runs scrape.py at most once per day. Invoked by launchd (see install_launchd.sh).
set -u

SCRAPER_DIR="${0:A:h}"
LOG_DIR="$SCRAPER_DIR/logs"
STAMP_FILE="$LOG_DIR/last_run_date"
TODAY="$(date +%F)"

mkdir -p "$LOG_DIR"
exec >>"$LOG_DIR/scraper.log" 2>&1

if [[ -f "$STAMP_FILE" && "$(cat "$STAMP_FILE")" == "$TODAY" ]]; then
    exit 0
fi

if [[ ! -f "$SCRAPER_DIR/ssentialServiceKey.json" ]] || grep -q 'REPLACE_ME' "$SCRAPER_DIR/ssentialServiceKey.json"; then
    echo "[$(date)] ssentialServiceKey.json is missing or still has placeholder values; skipping."
    exit 1
fi

echo "[$(date)] Starting scrape"
cd "$SCRAPER_DIR"
"$SCRAPER_DIR/.venv/bin/python" scrape.py
STATUS=$?
if (( STATUS == 0 )); then
    echo "$TODAY" > "$STAMP_FILE"
    echo "[$(date)] Scrape finished"
else
    echo "[$(date)] Scrape failed (exit $STATUS); will retry on next trigger"
    exit 1
fi
