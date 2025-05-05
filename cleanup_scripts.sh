#!/usr/bin/env bash
set -euo pipefail

# Clean up duplicate script tags in all HTML files
echo "Cleaning up duplicate script tags in all HTML files..."

for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Create a temporary file
    TEMP_FILE=$(mktemp)
    
    # Remove non-module waitlist-modal.js script if there's also a type="module" version
    if grep -q '<script.*waitlist-modal.js.*type="module"' "$file" && \
       grep -q '<script.*waitlist-modal.js[^(type="module")]' "$file"; then
      echo "  -> Removing non-module waitlist-modal.js script"
      grep -v '<script.*waitlist-modal.js[^(type="module")]' "$file" > "$TEMP_FILE"
      mv "$TEMP_FILE" "$file"
    fi
    
    # Remove duplicate waitlist-header-connector.js scripts
    CONNECTOR_COUNT=$(grep -c '<script.*waitlist-header-connector.js' "$file" || true)
    if [ "$CONNECTOR_COUNT" -gt "1" ]; then
      echo "  -> Removing duplicate waitlist-header-connector.js scripts (keeping one)"
      
      # Keep only the last instance of the script
      grep -n '<script.*waitlist-header-connector.js' "$file" | head -n $(($CONNECTOR_COUNT - 1)) | cut -d ':' -f 1 > "$TEMP_FILE.lines"
      
      # Create a sed command to delete these lines
      SED_CMD=""
      while read line; do
        SED_CMD="${SED_CMD}${line}d;"
      done < "$TEMP_FILE.lines"
      
      if [ -n "$SED_CMD" ]; then
        sed "$SED_CMD" "$file" > "$TEMP_FILE"
        mv "$TEMP_FILE" "$file"
      fi
      
      rm -f "$TEMP_FILE.lines"
    fi
    
    # Make sure the scripts have the correct order and type
    WAITLIST_MODAL_LINE=$(grep -n '<script.*waitlist-modal.js' "$file" | cut -d ':' -f 1 || echo "")
    CONNECTOR_LINE=$(grep -n '<script.*waitlist-header-connector.js' "$file" | cut -d ':' -f 1 || echo "")
    
    # Check if both scripts exist and are in the wrong order
    if [ -n "$WAITLIST_MODAL_LINE" ] && [ -n "$CONNECTOR_LINE" ] && [ "$WAITLIST_MODAL_LINE" -gt "$CONNECTOR_LINE" ]; then
      echo "  -> Fixing script order for waitlist scripts"
      
      # Create a temp file
      cp "$file" "$TEMP_FILE"
      
      # Extract the script tags
      MODAL_SCRIPT=$(grep '<script.*waitlist-modal.js' "$file")
      CONNECTOR_SCRIPT=$(grep '<script.*waitlist-header-connector.js' "$file")
      
      # Remove both script tags
      grep -v '<script.*waitlist-modal.js' "$TEMP_FILE" | grep -v '<script.*waitlist-header-connector.js' > "$file"
      
      # Add the scripts in the correct order before </body>
      sed -i '' -e '/<\/body>/i\
'"$MODAL_SCRIPT"'\
'"$CONNECTOR_SCRIPT"'' "$file"
    fi
    
    # Make sure the scripts have correct type="module" attribute
    if grep -q '<script.*waitlist-modal.js' "$file" && ! grep -q '<script.*waitlist-modal.js.*type="module"' "$file"; then
      echo "  -> Adding type=\"module\" to waitlist-modal.js script"
      sed -i '' 's/<script.*waitlist-modal.js/<script type="module" src="\.\/js\/waitlist-modal.js/g' "$file"
    fi
    
    if grep -q '<script.*waitlist-header-connector.js' "$file" && ! grep -q '<script.*waitlist-header-connector.js.*type="module"' "$file"; then
      echo "  -> Adding type=\"module\" to waitlist-header-connector.js script"
      sed -i '' 's/<script.*waitlist-header-connector.js/<script type="module" src="\.\/js\/waitlist-header-connector.js/g' "$file"
    fi
    
    # Clean up temp file if it still exists
    [ -f "$TEMP_FILE" ] && rm "$TEMP_FILE"
  fi
done

echo "Cleanup completed." 