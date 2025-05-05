#!/usr/bin/env bash
set -euo pipefail

# Inject includes and scripts into HTML files
echo "Injecting waitlist components into HTML files..."

for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Add or update scripts before </body>
    if grep -q '<script.*waitlist-modal.js' "$file"; then
      # Remove existing waitlist scripts to avoid duplicates
      sed -i '' '/<script.*waitlist-modal.js/d' "$file"
      sed -i '' '/<script.*waitlist-header-connector.js/d' "$file"
    fi
    
    # Add new scripts in the correct order
    echo "  -> Adding waitlist scripts"
    sed -i '' '/\(<\/body>\)/i\\
<script type="module" src="./js/waitlist-modal.js" defer><\/script>\\
<script type="module" src="./js/waitlist-header-connector.js" defer><\/script>
' "$file"
  fi
done

echo "Injection completed." 