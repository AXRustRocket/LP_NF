#!/usr/bin/env bash
set -euo pipefail

for file in *.html; do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    
    # Create a temporary file
    tmp_file=$(mktemp)
    
    # Remove duplicate headers and add the correct one
    awk '
      BEGIN { header_section = 0; header_printed = 0; }
      /<!-- BEGIN HEADER -->/ { 
        if (header_printed == 0) {
          print "<!-- BEGIN HEADER -->";
          system("cat partials/new-header.html");
          print "<!-- END HEADER -->";
          header_printed = 1;
        }
        header_section = 1;
        next;
      }
      /<!-- END HEADER -->/ { 
        header_section = 0;
        next;
      }
      !header_section {
        if ($0 ~ /<\/head>/) {
          print "<!--#include file=\"partials/waitlist-modal.html\" -->";
          print "<script src=\"./js/waitlist-modal.js\" type=\"module\" defer></script>";
          print "<script src=\"./js/waitlist-header-connector.js\" type=\"module\" defer></script>";
          print $0;
        } else if ($0 !~ /waitlist-modal.js/ && $0 !~ /waitlist-header-connector.js/ && $0 !~ /partials\/waitlist-modal.html/) {
          print $0;
        }
      }
    ' "$file" > "$tmp_file"
    
    # Replace the original file with the fixed version
    mv "$tmp_file" "$file"
  fi
done

echo "All files fixed." 