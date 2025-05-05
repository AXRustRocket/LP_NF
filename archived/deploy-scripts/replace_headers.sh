#!/usr/bin/env bash
set -euo pipefail

# Replace headers in all HTML files with the static header from partials/new-header.html
echo "Replacing headers in all HTML files..."

# Check if partials/new-header.html exists
if [ ! -f "partials/new-header.html" ]; then
  echo "Error: partials/new-header.html does not exist"
  exit 1
fi

# Create a temporary file with the header content
TEMP_HEADER_FILE=$(mktemp)
cat partials/new-header.html > "$TEMP_HEADER_FILE"

# Replace old header blocks in each HTML file
for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Create a temporary file for this HTML file
    TEMP_FILE=$(mktemp)
    
    # Case 1: Standard pattern with "Header Container" comment
    if grep -q '<!-- Header Container -->' "$file"; then
      echo "  -> Found Header Container comment"
      
      # Extract line numbers for the section we want to replace
      START_LINE=$(grep -n '<!-- Header Container -->' "$file" | head -n 1 | cut -d':' -f1)
      
      # Find the next major section after the header
      NEXT_SECTION_LINE=$(awk "NR > $START_LINE && /<!-- BEGIN .*/ {print NR; exit}" "$file")
      
      if [ -z "$NEXT_SECTION_LINE" ]; then
        # If no next section found, try to find another reasonable ending point
        NEXT_SECTION_LINE=$(awk "NR > $START_LINE && /<section/ {print NR; exit}" "$file")
      fi
      
      if [ -z "$NEXT_SECTION_LINE" ]; then
        echo "  -> No clear end of header section found, using 20 lines after start"
        NEXT_SECTION_LINE=$((START_LINE + 20))
      fi
      
      # Copy the file up to the header section
      head -n $((START_LINE - 1)) "$file" > "$TEMP_FILE"
      
      # Add the header container comment and the new header
      echo "<!-- Header Container -->" >> "$TEMP_FILE"
      cat "$TEMP_HEADER_FILE" >> "$TEMP_FILE"
      echo "" >> "$TEMP_FILE"
      
      # Continue with the rest of the file from the next section
      tail -n +$NEXT_SECTION_LINE "$file" >> "$TEMP_FILE"
      
      # Replace the original file
      mv "$TEMP_FILE" "$file"
      echo "  -> Replaced header in $file (Standard pattern)"
    
    # Case 2: Different header pattern with just a header tag
    elif grep -q '<header' "$file"; then
      echo "  -> Found header tag"
      
      # Get line number of header opening tag
      HEADER_START=$(grep -n '<header' "$file" | head -n 1 | cut -d':' -f1)
      
      # Find line number of closing header tag
      HEADER_END=$(awk "NR >= $HEADER_START && /<\/header>/ {print NR; exit}" "$file")
      
      if [ -z "$HEADER_END" ]; then
        echo "  -> No closing header tag found, skipping"
        rm "$TEMP_FILE"
        continue
      fi
      
      # Copy the file up to the header section
      head -n $((HEADER_START - 1)) "$file" > "$TEMP_FILE"
      
      # Add the new header
      cat "$TEMP_HEADER_FILE" >> "$TEMP_FILE"
      
      # Continue with the rest of the file after the header
      tail -n +$((HEADER_END + 1)) "$file" >> "$TEMP_FILE"
      
      # Replace the original file
      mv "$TEMP_FILE" "$file"
      echo "  -> Replaced header in $file (header tag pattern)"
    
    # Case 3: No recognizable header pattern, insert at beginning of body
    else
      echo "  -> No header pattern found, inserting at beginning of body"
      
      # Get line number of body opening tag
      BODY_START=$(grep -n '<body' "$file" | head -n 1 | cut -d':' -f1)
      
      if [ -z "$BODY_START" ]; then
        echo "  -> No body tag found, skipping"
        rm "$TEMP_FILE"
        continue
      fi
      
      # Copy the file up to the body tag
      head -n $BODY_START "$file" > "$TEMP_FILE"
      
      # Extract the body tag line
      BODY_TAG=$(sed -n "${BODY_START}p" "$file")
      
      # Add the body tag and the new header
      echo "$BODY_TAG" >> "$TEMP_FILE"
      cat "$TEMP_HEADER_FILE" >> "$TEMP_FILE"
      
      # Continue with the rest of the file after the body tag
      tail -n +$((BODY_START + 1)) "$file" >> "$TEMP_FILE"
      
      # Replace the original file
      mv "$TEMP_FILE" "$file"
      echo "  -> Inserted header at beginning of body in $file"
    fi
    
    # Clean up temp file if it still exists
    [ -f "$TEMP_FILE" ] && rm "$TEMP_FILE"
    
    # Now add the script tags if needed
    TEMP_FILE=$(mktemp)
    
    # Check if the script tags are already in the file
    if ! grep -q 'waitlist-modal.js.*type="module"' "$file"; then
      echo "  -> Adding script tags for waitlist modal and connector"
      
      # Find </body> tag
      BODY_END=$(grep -n '</body>' "$file" | tail -n 1 | cut -d':' -f1)
      
      if [ -z "$BODY_END" ]; then
        echo "  -> No closing body tag found, skipping script addition"
        continue
      fi
      
      # Copy the file up to just before </body>
      head -n $((BODY_END - 1)) "$file" > "$TEMP_FILE"
      
      # Add script tags
      echo '<script type="module" src="./js/waitlist-modal.js" defer></script>' >> "$TEMP_FILE"
      echo '<script type="module" src="./js/waitlist-header-connector.js" defer></script>' >> "$TEMP_FILE"
      
      # Add closing body tag and the rest of the file
      echo "</body>" >> "$TEMP_FILE"
      tail -n +$((BODY_END + 1)) "$file" >> "$TEMP_FILE"
      
      # Replace the original file
      mv "$TEMP_FILE" "$file"
    elif ! grep -q 'waitlist-header-connector.js' "$file"; then
      echo "  -> Adding waitlist-header-connector.js script"
      
      # Find the line with waitlist-modal.js
      MODAL_SCRIPT_LINE=$(grep -n 'waitlist-modal.js' "$file" | head -n 1 | cut -d':' -f1)
      
      if [ -z "$MODAL_SCRIPT_LINE" ]; then
        echo "  -> No waitlist-modal.js script found, skipping connector addition"
        continue
      fi
      
      # Copy the file up to just after the modal script line
      head -n $MODAL_SCRIPT_LINE "$file" > "$TEMP_FILE"
      
      # Add connector script tag
      echo '<script type="module" src="./js/waitlist-header-connector.js" defer></script>' >> "$TEMP_FILE"
      
      # Add the rest of the file
      tail -n +$((MODAL_SCRIPT_LINE + 1)) "$file" >> "$TEMP_FILE"
      
      # Replace the original file
      mv "$TEMP_FILE" "$file"
    fi
    
    # Clean up temp file if it still exists
    [ -f "$TEMP_FILE" ] && rm "$TEMP_FILE"
  fi
done

# Clean up
rm "$TEMP_HEADER_FILE"

echo "Header replacement finished." 