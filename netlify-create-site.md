# Manuelle Netlify Site-Erstellung

Da das automatische Login nicht funktioniert, hier die Schritte zur manuellen Erstellung:

1. Öffne im Browser: https://app.netlify.com/
2. Melde dich an oder erstelle einen Account
3. Klicke auf "Add new site" → "Import an existing project"
4. Wähle "Deploy manually" (unten auf der Seite)
5. Gib deinem Projekt einen Namen (z.B. "rustrocket")
6. Nachdem die Site erstellt ist, kopiere die Site ID aus den Site-Einstellungen

## Nach der Site-Erstellung

1. Kopiere die Site ID aus den Site-Einstellungen:
   - Site settings → General → Site details → Site ID

2. Aktualisiere die `.netlify/state.json` Datei:
   ```json
   {
     "siteId": "deine-kopierte-site-id"
   }
   ```

3. Aktualisiere auch die `deploy-with-token.sh` Datei mit der Site ID

4. Führe einen manuellen Deploy durch:
   ```bash
   cd /Users/m.schroeder/Desktop/RR_Content/axiom_LP
   npm run build
   netlify deploy --prod --dir=dist --auth nfp_6nDBuPgvxtRHctJ76dPqdTgLozTqPXHi10db --site deine-kopierte-site-id
   ```

## Umgebungsvariablen einrichten

Nach dem ersten erfolgreichen Deploy solltest du auch die Umgebungsvariablen in Netlify setzen:

1. Gehe zu Site settings → Environment variables
2. Füge folgende Variablen hinzu:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `VITE_SUPABASE_ANON_KEY`
   - `SIGNALS_API_KEY`

Die Werte findest du in den Projektdokumenten (AUTHENTICATION_SETUP.md). 