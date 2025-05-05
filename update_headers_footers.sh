#!/usr/bin/env bash
set -euo pipefail

# Inject includes into HTML files in the current directory

echo "Injecting includes into *.html files..."

for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # GA before </head> (add if missing)
    if ! grep -q '<!--#include file="partials/ga.html" -->' "$file"; then
      sed -i '' '/\(<\/head>\)/i\
<!--#include file="partials/ga.html" -->
' "$file"
      echo "  -> Added GA include."
    fi

    # Modal & JS before </body> (add if missing)
    if ! grep -q '<!--#include file="partials/waitlist-modal.html" -->' "$file"; then
      # Remove orphaned script just in case
      sed -i '' '/<script src=".\/js\/waitlist-modal.js" defer><\/script>/d' "$file"
      # Add both
      sed -i '' '/\(<\/body>\)/i\
<!--#include file="partials/waitlist-modal.html" -->\
<script src="./js/waitlist-modal.js" defer><\/script>
' "$file"
      echo "  -> Added Modal include + script."
    else
      # If modal include exists, ensure script exists too
       if ! grep -q '<script src="./js/waitlist-modal.js" defer><\/script>' "$file"; then
            sed -i '' '/<!--#include file="partials\/waitlist-modal.html" -->/a\
<script src="./js/waitlist-modal.js" defer><\/script>
' "$file"
            echo "  -> Added missing modal script tag."
        fi
    fi
  fi
done

echo "Include injection finished." 