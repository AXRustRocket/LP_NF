#!/usr/bin/env bash
set -euo pipefail

for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file: $file"
    
    # Create a temporary file
    tmp_file=$(mktemp)
    
    # Process the file line by line
    while IFS= read -r line; do
      # Output the line as is
      echo "$line" >> "$tmp_file"
      
      # If this is the </body> line, insert our scripts before it
      if [[ "$line" == *"</body>"* ]]; then
        echo '<script type="module" src="./js/waitlist-modal.js" defer></script>' >> "$tmp_file"
        echo '<script type="module" src="./js/waitlist-header-connector.js" defer></script>' >> "$tmp_file"
      fi
    done < "$file"
    
    # Replace the original file with the modified one
    mv "$tmp_file" "$file"
  fi
done

echo "Script injection completed." 