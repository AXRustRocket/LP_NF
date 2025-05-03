# Produktions-Setup für www.rust-rocket.com

Diese Anleitung beschreibt die Schritte, um die Seite für die Produktionsumgebung auf www.rust-rocket.com vorzubereiten.

## 1. Netlify-Site umbenennen & Domain verbinden

Da die CLI-Befehle Probleme bereiten, folgen Sie diesen manuellen Schritten im Netlify-Dashboard:

1. Gehen Sie zu https://app.netlify.com/sites/rust-rocketx/settings/general
2. Ändern Sie den Site-Namen zu "rust-rocketx" (falls noch nicht geschehen)
3. Gehen Sie zu https://app.netlify.com/sites/rust-rocketx/settings/domain
4. Klicken Sie auf "Add custom domain"
5. Geben Sie "www.rust-rocket.com" ein und folgen Sie den Anweisungen

## 2. DNS-Einträge bei IONOS einrichten

Fügen Sie diesen DNS-Eintrag in Ihrem IONOS-Dashboard hinzu:

| Typ   | Host | Ziel/Wert               |
|-------|------|-------------------------|
| CNAME | www  | rust-rocketx.netlify.app |

## 3. Environment-Variablen setzen

Über das Netlify-Dashboard:

1. Gehen Sie zu https://app.netlify.com/sites/rust-rocketx/settings/env
2. Fügen Sie folgende Variablen hinzu:
   - `VITE_SUPABASE_URL`: https://jpvbnbphgvtokbrlctke.supabase.co
   - `VITE_SUPABASE_ANON_KEY`: [erster Key aus User-Nachricht]
   - `SUPABASE_SERVICE_KEY`: [zweiter Key aus User-Nachricht]

## 4. Supabase Auth-Whitelist aktualisieren

1. Öffnen Sie die Supabase-Konsole für das Projekt jpvbnbphgvtokbrlctke
2. Gehen Sie zu Auth → Settings → URL Configuration
3. Fügen Sie folgende URLs zu den Redirect URLs hinzu:
   - https://www.rust-rocket.com
   - https://rust-rocketx.netlify.app (belassen)

## 5. Code-Konfiguration anpassen

### README.md aktualisieren:

Alle URLs von "rustrocket.netlify.app" oder Ähnlichem zu "www.rust-rocket.com" ändern.

### netlify.toml überprüfen:

Sicherstellen, dass der SPA-Fallback aktiviert ist:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
  force = false
  conditions = {Role = ["admin", "owner", "member"]}
```

## 6. Finaler Build & Deploy

```bash
npm run build
./deploy-with-token.sh  # Verwendet Site-ID rust-rocketx
```

## 7. Smoke-Tests

Nach dem Deploy folgende Tests durchführen:
- https://www.rust-rocket.com Startseite laden
- Auth-Funktion testen
- Dashboard-Zugriff nach Login prüfen
- Magic-Link Login → Redirect-Funktionalität prüfen
- Waitlist-Formular testen → Eintrag in Supabase-Tabelle prüfen

## 8. Änderungen dokumentieren und committen

```bash
git add README.md DEPLOY_CHECKLIST.md DOMAIN-SETUP.md PRODUCTION-SETUP.md
git commit -m "docs: switch to custom domain www.rust-rocket.com"
git push origin main
``` 