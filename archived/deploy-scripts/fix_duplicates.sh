#!/usr/bin/env bash
set -euo pipefail

# Fix duplicate script tags with a simpler approach
echo "Fixing duplicate script tags in all HTML files..."

for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Create a temporary file
    TEMP_FILE=$(mktemp)
    
    # Replace all non-module script tags for waitlist scripts with module versions
    cat "$file" | sed 's/<script src="\.\/js\/waitlist-modal.js" defer><\/script>/<script type="module" src="\.\/js\/waitlist-modal.js" defer><\/script>/g' > "$TEMP_FILE"
    mv "$TEMP_FILE" "$file"
    
    cat "$file" | sed 's/<script src="\.\/js\/waitlist-header-connector.js" defer><\/script>/<script type="module" src="\.\/js\/waitlist-header-connector.js" defer><\/script>/g' > "$TEMP_FILE"
    mv "$TEMP_FILE" "$file"
    
    # Count occurrences of each script
    MODAL_COUNT=$(grep -c '<script.*waitlist-modal.js' "$file" || true)
    CONNECTOR_COUNT=$(grep -c '<script.*waitlist-header-connector.js' "$file" || true)
    
    echo "  -> Found $MODAL_COUNT modal scripts and $CONNECTOR_COUNT connector scripts"
    
    # If duplicate modal scripts exist, keep only the last one
    if [ "$MODAL_COUNT" -gt "1" ]; then
      echo "  -> Removing duplicate modal scripts"
      grep -v '<script.*waitlist-modal.js' "$file" > "$TEMP_FILE"
      echo '<script type="module" src="./js/waitlist-modal.js" defer></script>' >> "$TEMP_FILE"
      mv "$TEMP_FILE" "$file"
    fi
    
    # If duplicate connector scripts exist, keep only the last one
    if [ "$CONNECTOR_COUNT" -gt "1" ]; then
      echo "  -> Removing duplicate connector scripts"
      grep -v '<script.*waitlist-header-connector.js' "$file" > "$TEMP_FILE"
      echo '<script type="module" src="./js/waitlist-header-connector.js" defer></script>' >> "$TEMP_FILE"
      mv "$TEMP_FILE" "$file"
    fi
    
    # If no modal script exists, add it
    if [ "$MODAL_COUNT" -eq "0" ]; then
      echo "  -> Adding missing modal script"
      sed -i '' '/<\/body>/i\
<script type="module" src="./js/waitlist-modal.js" defer></script>' "$file"
    fi
    
    # If no connector script exists, add it after the modal script
    if [ "$CONNECTOR_COUNT" -eq "0" ]; then
      echo "  -> Adding missing connector script"
      sed -i '' '/<script.*waitlist-modal.js/a\
<script type="module" src="./js/waitlist-header-connector.js" defer></script>' "$file"
    fi
    
    # Final check - ensure correct order
    MODAL_LINE=$(grep -n '<script.*waitlist-modal.js' "$file" | head -n 1 | cut -d ':' -f 1 || echo "0")
    CONNECTOR_LINE=$(grep -n '<script.*waitlist-header-connector.js' "$file" | head -n 1 | cut -d ':' -f 1 || echo "0")
    
    if [ "$MODAL_LINE" -gt "$CONNECTOR_LINE" ] && [ "$CONNECTOR_LINE" -ne "0" ]; then
      echo "  -> Fixing script order"
      grep -v '<script.*waitlist-modal.js\|<script.*waitlist-header-connector.js' "$file" > "$TEMP_FILE"
      sed -i '' '/<\/body>/i\
<script type="module" src="./js/waitlist-modal.js" defer></script>\
<script type="module" src="./js/waitlist-header-connector.js" defer></script>' "$TEMP_FILE"
      mv "$TEMP_FILE" "$file"
    fi
    
    # Clean up the temporary file if it still exists
    [ -f "$TEMP_FILE" ] && rm "$TEMP_FILE"
  fi
done

echo "Duplicate script fixing completed." 