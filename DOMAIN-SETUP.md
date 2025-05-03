# Domain-Setup für rust-rocket.com bei IONOS

## DNS-Einträge für IONOS

Fügen Sie die folgenden DNS-Einträge in Ihrem IONOS-Dashboard hinzu:

| Typ   | Host | Ziel/Wert               |
|-------|------|-------------------------|
| CNAME | www  | rust-rocketx.netlify.app |

**Hinweis**: Ein ALIAS/ANAME oder A-Record für die Root-Domain ist nicht erforderlich, da wir nur die www-Subdomain verwenden.

## Netlify-Konfiguration

Die Domain-Einstellung in Netlify kann über das Dashboard erfolgen:

1. Gehe zu https://app.netlify.com/sites/rust-rocketx/settings/domain
2. Klicke auf "Add custom domain"
3. Gib "www.rust-rocket.com" ein
4. Folge den Anweisungen zur Verifizierung

## Überprüfung

Nach der Einrichtung und Propagation der DNS-Einträge (kann bis zu 48 Stunden dauern):

```bash
dig www.rust-rocket.com +short
# Sollte zurückgeben: rust-rocketx.netlify.app
``` 