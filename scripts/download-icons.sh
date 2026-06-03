#!/bin/bash
# Wowhead Icon Batch Downloader (Shell version)
# Usage: bash scripts/download-icons.sh
# Requires: curl

set -e

ICON_BASE_URL="https://wow.zamimg.com/images/wow/icons/medium"
OUTPUT_DIR="frontend/public/assets/icons/wow"
ICON_LIST="/tmp/icon_list.txt"
CONCURRENCY=10

mkdir -p "$OUTPUT_DIR"

total=$(wc -l < "$ICON_LIST" | tr -d ' ')
downloaded=0
skipped=0
failed=0

# Function to download a single icon
download_icon() {
    local icon=$1
    local url="${ICON_BASE_URL}/${icon}.jpg"
    local out="${OUTPUT_DIR}/${icon}.jpg"

    # Skip if exists and non-empty
    if [[ -f "$out" && -s "$out" ]]; then
        ((skipped++))
        return
    fi

    if curl -sfL --max-time 15 \
        -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36" \
        -H "Accept: image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8" \
        -H "Referer: https://www.wowhead.com/" \
        "$url" -o "$out" 2>/dev/null; then
        # Verify not empty
        if [[ -s "$out" ]]; then
            ((downloaded++))
        else
            rm -f "$out"
            ((failed++))
        fi
    else
        rm -f "$out"
        ((failed++))
    fi
}

export -f download_icon
export ICON_BASE_URL OUTPUT_DIR downloaded skipped failed

# Use GNU parallel if available, otherwise fallback to xargs
if command -v parallel >/dev/null 2>&1; then
    cat "$ICON_LIST" | parallel --jobs "$CONCURRENCY" download_icon
else
    cat "$ICON_LIST" | xargs -P "$CONCURRENCY" -I{} bash -c 'download_icon "$@"' _ {}
fi

echo ""
echo "========================================"
echo "Download complete!"
echo "Total: $total"
echo "Downloaded: $downloaded"
echo "Skipped: $skipped"
echo "Failed: $failed"
echo "========================================"
