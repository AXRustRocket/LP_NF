# Anleitung für manuelle Netlify-Konfiguration

Da du Probleme mit dem interaktiven Login hast, hier alternative Wege:

## Methode 1: Mit Personal Access Token

1. **Token erstellen**:
   - Öffne im Browser: https://app.netlify.com/user/applications
   - Erstelle ein neues "Personal access token"
   - Gib ihm einen passenden Namen (z.B. "CLI Deployment")
   - Kopiere das Token

2. **Anmelden per Token**:
   ```
   netlify login --auth DEIN_TOKEN_HIER
   ```

## Methode 2: Direkte Konfiguration

1. **Site ID herausfinden**:
   - Gehe zu deiner Netlify Site (https://app.netlify.com/sites/rustrocket)
   - Die Site ID findest du unter Site settings → General → Site details → Site ID

2. **Konfiguration manuell erstellen**:
   - Öffne `.netlify/state.json`
   - Setze die korrekte Site ID ein:
   ```json
   {
     "siteId": "deine-echte-site-id"
   }
   ```

3. **Für CI/CD-Umgebungen**:
   ```bash
   # Umgebungsvariablen setzen
   export NETLIFY_AUTH_TOKEN="dein-token"
   export NETLIFY_SITE_ID="deine-site-id"
   
   # Deployment ausführen
   npm run build
   netlify deploy --prod --dir=dist --auth $NETLIFY_AUTH_TOKEN --site $NETLIFY_SITE_ID
   ```

## Methode 3: Site manuell verknüpfen

Versuche den direkten Befehl zur Site-Verknüpfung:
```
netlify link --name rustrocket
```

oder:
```
netlify link --id deine-site-id
``` 