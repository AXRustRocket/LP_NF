# Rust Rocket

![Lighthouse](https://img.shields.io/badge/Lighthouse-Performance%3A%20100%20%7C%20Accessibility%3A%20100%20%7C%20Best%20Practices%3A%20100%20%7C%20SEO%3A%20100-success)

[![Netlify Status](https://api.netlify.com/api/v1/badges/5ce2eb18-4180-4f69-adb4-e110eb5df787/deploy-status)](https://app.netlify.com/sites/rust-rocket/deploys)
[![CI](https://github.com/AXRustRocket/LP_NF/actions/workflows/ci-prod.yml/badge.svg)](https://github.com/AXRustRocket/LP_NF/actions/workflows/ci-prod.yml)

Ultraschneller Meme-Coin Trading Bot mit <50ms Latenz und erweiterten Rug-Schutz. Vollständig reguliert nach dem Liechtensteiner TVTG-Rahmenwerk.

## Optimierungen

### Core Web Vitals

- **LCP (Largest Contentful Paint)**: < 1.8s dank optimierter Bildkomprimierung, Preloading und effizientem CSS-Loading
- **CLS (Cumulative Layout Shift)**: < 0.05 durch vorgegebene Dimensionen für Navbar, Hero und DOM-Elemente
- **INP (Interaction to Next Paint)**: < 200ms mittels optimierter JavaScript-Ausführung mit requestIdleCallback und minimiertem DOM-Zugriff

### Performance Features

- Vite mit esbuild für schnelles Bundling und optimiertes JS/CSS
- Brotli- und GZIP-Komprimierung für alle statischen Assets
- Automatische Bildoptimierung (WebP/AVIF) mit korrektem Sizing
- PWA-Support für Offline-Funktionalität
- Effizientes Code-Splitting und Lazy-Loading

### SEO & KI-Visibility

- Strukturierte Daten (JSON-LD) für Rich Snippets
- KI-Optimierte Metainformationen in siteinfo.txt
- OpenAI Plugin Manifest für ChatGPT-Integration
- Vollständige Sitemap mit priorisierten URLs
- Optimierte Robot.txt für maximale Crawler-Effizienz

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run serve

# Build for production
npm run build
```

## Deployment

Die Anwendung wird automatisch über Git-basiertes Deployment mit Netlify bereitgestellt:

1. Änderungen auf main-Branch committen:
   ```bash
   git add .
   git commit -m "Beschreibung der Änderungen"
   git push origin main
   ```

2. Netlify triggert automatisch einen Build und Deployment bei jedem Push auf den main-Branch.

3. Der Build-Status kann unter https://app.netlify.com/sites/rust-rocket/deploys überprüft werden.

### Umgebungsvariablen

Die folgenden Umgebungsvariablen sind in der Netlify-Umgebung konfiguriert:

```
SUPABASE_URL = https://jpvbnbphgvtokbrlctke.supabase.co
SUPABASE_SERVICE_KEY = [geheimer Schlüssel]
SUPABASE_ANON_KEY = [öffentlicher Schlüssel]
```

**Wichtig:** Die Umgebungsvariablen sind im Scope "functions" konfiguriert und stehen nur für Netlify Serverless Functions zur Verfügung.

## Lighthouse CI

Das Projekt nutzt Lighthouse CI zur kontinuierlichen Überwachung der Performance-Metriken. Die lokalen Tests prüfen automatisch, dass alle Core Web Vitals den folgenden Anforderungen entsprechen:

- Performance: ≥ 95
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## TVTG-Compliance

Als erster vollständig regulierter Anbieter gemäß dem liechtensteinischen TVTG-Rahmenwerk bieten wir institutionellen Kunden höchste Sicherheit und Transparenz.

---

© Axiom Enterprise AG. Alle Rechte vorbehalten.
