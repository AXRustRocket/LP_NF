#!/bin/bash
set -euo pipefail

for file in *.html; do
  echo "Fixing duplicate tags in $file"
  
  # Temporäre Datei erstellen
  tmp_file=$(mktemp)
  
  # Entferne doppelte BEGIN HEADER Tags
  sed 's/<!-- BEGIN HEADER --><!-- BEGIN HEADER -->/<!-- BEGIN HEADER -->/g' "$file" > "$tmp_file"
  
  # Entferne doppelte END HEADER Tags
  sed -i.bak 's/<!-- END HEADER --> <!-- END HEADER -->/<!-- END HEADER -->/g' "$tmp_file"
  
  # Bereinige auch Tags, die auf separaten Zeilen stehen
  awk '{
    if ($0 ~ /<!-- BEGIN HEADER -->/ && getline && $0 ~ /<!-- BEGIN HEADER -->/) {
      print "<!-- BEGIN HEADER -->";
    } else if ($0 ~ /<!-- END HEADER -->/ && getline && $0 ~ /<!-- END HEADER -->/) {
      print "<!-- END HEADER -->";
    } else {
      print $0;
    }
  }' "$tmp_file" > "$tmp_file.new"
  
  # Ersetze die Originaldatei durch die bereinigte Version
  mv "$tmp_file.new" "$file"
  
  # Temporäre Dateien entfernen
  rm -f "$tmp_file" "$tmp_file.bak"
  
  echo "Fixed $file"
done

echo "All files fixed." 