#!/usr/bin/env bash
set -euo pipefail

for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Create a temporary file
    tmp_file=$(mktemp)
    
    # Flag to track if we've found and replaced the header
    header_replaced=false
    
    # Process the file line by line
    while IFS= read -r line; do
      # If we find the beginning of the old header, insert our new header
      if [[ "$line" == *"<!-- BEGIN HEADER -->"* ]]; then
        cat partials/new-header.html >> "$tmp_file"
        header_replaced=true
        
        # Skip lines until we find the end of the header
        while IFS= read -r header_line; do
          if [[ "$header_line" == *"<!-- END HEADER -->"* ]]; then
            break
          fi
        done < <(tail -n +$(($(grep -n "$line" "$file" | cut -d: -f1) + 1)) "$file")
      # If this is the closing </head> tag, insert the waitlist modal script
      elif [[ "$line" == *"</head>"* ]]; then
        echo "$line" >> "$tmp_file"
        # Add the include for waitlist-modal.html
        echo '<!--#include file="partials/waitlist-modal.html" -->' >> "$tmp_file"
        echo '<script src="./js/waitlist-modal.js" type="module" defer></script>' >> "$tmp_file"
        echo '<script src="./js/waitlist-header-connector.js" type="module" defer></script>' >> "$tmp_file"
      # If this is the </body> tag and we are already processing the file
      elif [[ "$line" == *"</body>"* ]]; then
        # Insert the modal HTML before closing body tag
        echo '<!--#include file="partials/waitlist-modal.html" -->' >> "$tmp_file"
        echo "$line" >> "$tmp_file"
      else
        # Output the line as is
        echo "$line" >> "$tmp_file"
      fi
    done < "$file"
    
    # Replace the original file with the modified one
    mv "$tmp_file" "$file"
    
    if [ "$header_replaced" = false ]; then
      echo "WARNING: Header not replaced in $file - could not find '<!-- BEGIN HEADER -->' marker"
    fi
  fi
done

echo "Header and script injection completed." 