#!/usr/bin/env bash
set -euo pipefail

# Inject includes into HTML files in the current directory

echo "Injecting includes into *.html files..."

# Read the modal HTML content for inline embedding
MODAL_HTML=$(cat partials/waitlist-modal.html)

for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # 1. Add modal HTML before </head> (add if missing)
    if ! grep -q 'id="waitlistModal"' "$file"; then
      sed -i '' '/\(<\/head>\)/i\
'"$MODAL_HTML"'
' "$file"
      echo "  -> Added modal HTML."
    fi
    
    # 2. Add JS scripts before </body> (add if missing or update)
    if grep -q '<script.*waitlist-modal.js' "$file"; then
      # Remove existing waitlist scripts to avoid duplicates
      sed -i '' '/<script.*waitlist-modal.js/d' "$file"
      sed -i '' '/<script.*waitlist-header-connector.js/d' "$file"
    fi
    
    # Add the new scripts in correct order
    sed -i '' '/\(<\/body>\)/i\
<script type="module" src="./js/waitlist-modal.js" defer></script>\
<script type="module" src="./js/waitlist-header-connector.js" defer></script>
' "$file"
    echo "  -> Added/Updated waitlist script tags."
  fi
done

echo "Injection finished." 