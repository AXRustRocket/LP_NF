#!/bin/bash
set -euo pipefail

# Schritt 1: Ersetze die Header in allen HTML-Dateien
for file in *.html; do
  echo "Cleaning header in $file"
  
  # Erstelle eine temporäre Datei
  tmpfile=$(mktemp)
  
  # Lese die Datei Zeile für Zeile und ersetze den Header-Bereich
  in_header=false
  while IFS= read -r line; do
    # Wenn wir den Beginn des Headers finden
    if [[ $line == *"<!-- BEGIN HEADER -->"* ]]; then
      # Markiere, dass wir im Header-Bereich sind
      in_header=true
      # Schreibe den Beginn-Tag
      echo "<!-- BEGIN HEADER -->" >> "$tmpfile"
      # Füge den Inhalt von new-header.html ein
      cat partials/new-header.html >> "$tmpfile"
      # Schreibe den End-Tag
      echo "<!-- END HEADER -->" >> "$tmpfile"
      
      # Überspringe Zeilen bis zum Ende des Headers
      while IFS= read -r header_line; do
        if [[ $header_line == *"<!-- END HEADER -->"* ]]; then
          break
        fi
      done
    # Wenn wir </head> finden, füge die Waitlist-Skripte ein
    elif [[ $line == *"</head>"* ]]; then
      echo '<!--#include file="partials/waitlist-modal.html" -->' >> "$tmpfile"
      echo '<script src="./js/waitlist-modal.js" type="module" defer></script>' >> "$tmpfile"
      echo '<script src="./js/waitlist-header-connector.js" type="module" defer></script>' >> "$tmpfile"
      echo "$line" >> "$tmpfile"
    # Wenn keine der obigen Bedingungen zutrifft, füge die Zeile unverändert ein
    elif [[ $in_header == false ]]; then
      # Füge nur Zeilen hinzu, die nicht die Waitlist-Skripte enthalten
      if [[ $line != *"waitlist-modal"* && $line != *"waitlist-header-connector"* ]]; then
        echo "$line" >> "$tmpfile"
      fi
    fi
    
    # Wenn wir das Ende des Headers finden, setze die Markierung zurück
    if [[ $line == *"<!-- END HEADER -->"* ]]; then
      in_header=false
    fi
  done < "$file"
  
  # Ersetze die Originaldatei durch die temporäre Datei
  mv "$tmpfile" "$file"
done

echo "All headers cleaned." 