#!/bin/zsh
# Installs (or reinstalls) the daily scraper job in launchd.
# Usage: ./install_launchd.sh [HOUR] [MINUTE]   (default 9:00)
set -eu

SCRAPER_DIR="${0:A:h}"
LABEL="com.ssential.scraper"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
HOUR="${1:-9}"
MINUTE="${2:-0}"

chmod +x "$SCRAPER_DIR/run_daily.sh"
mkdir -p "$SCRAPER_DIR/logs" "$HOME/Library/LaunchAgents"

# StartCalendarInterval fires on wake if the Mac was asleep at the scheduled time.
# RunAtLoad + the hourly StartInterval retry a failed or missed run; run_daily.sh's
# date stamp keeps it to one successful run per day.
cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>$LABEL</string>
    <key>ProgramArguments</key>
    <array>
        <string>$SCRAPER_DIR/run_daily.sh</string>
    </array>
    <key>StartCalendarInterval</key>
    <dict>
        <key>Hour</key>
        <integer>$HOUR</integer>
        <key>Minute</key>
        <integer>$MINUTE</integer>
    </dict>
    <key>StartInterval</key>
    <integer>3600</integer>
    <key>RunAtLoad</key>
    <true/>
    <key>StandardOutPath</key>
    <string>$SCRAPER_DIR/logs/launchd.out.log</string>
    <key>StandardErrorPath</key>
    <string>$SCRAPER_DIR/logs/launchd.err.log</string>
</dict>
</plist>
PLIST

launchctl bootout "gui/$(id -u)/$LABEL" 2>/dev/null || true
launchctl bootstrap "gui/$(id -u)" "$PLIST"
echo "Installed $LABEL (daily at $HOUR:$(printf %02d "$MINUTE")). Logs: $SCRAPER_DIR/logs/scraper.log"
