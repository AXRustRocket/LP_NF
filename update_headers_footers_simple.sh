#!/usr/bin/env bash
set -euo pipefail

for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file"
    
    # Create a temporary file
    tmp_file=$(mktemp)
    
    # Process the file line by line
    while IFS= read -r line; do
      # Output the line as is
      echo "$line" >> "$tmp_file"
      
      # If this is the </head> line, insert GA include
      if [[ "$line" == *"</head>"* ]]; then
        echo '<!--#include file="partials/ga.html" -->' >> "$tmp_file"
      fi
      
      # If this is the </body> line, insert modal and scripts
      if [[ "$line" == *"</body>"* ]]; then
        echo '<!--#include file="partials/waitlist-modal.html" -->' >> "$tmp_file"
        echo '<script src="./js/waitlist-modal.js" type="module" defer></script>' >> "$tmp_file"
        echo '<script src="./js/waitlist-header-connector.js" type="module" defer></script>' >> "$tmp_file"
      fi
    done < "$file"
    
    # Replace the original file with the modified one
    mv "$tmp_file" "$file"
  fi
done

echo "Script injection completed for all HTML files." 