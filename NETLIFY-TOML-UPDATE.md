# netlify.toml Aktualisierung

Fügen Sie den folgenden SPA-Fallback zur netlify.toml-Datei hinzu, direkt nach dem "/aml-policy"-Redirect und vor dem "[[headers]]"-Abschnitt:

```toml
# SPA-Fallback für clientseitige Routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Dieser Eintrag sorgt dafür, dass bei clientseitigen Routen immer die index.html ausgeliefert wird, was für SPAs (Single Page Applications) erforderlich ist.

Beispiel der korrekten Reihenfolge:

```toml
[[redirects]]
  from = "/aml-policy"
  to = "/legal/aml-policy.html"
  status = 301
  force = true

# SPA-Fallback für clientseitige Routing
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    ...
``` 