# Rust Rocket

![Lighthouse](https://img.shields.io/badge/Lighthouse-Performance%3A%20100%20%7C%20Accessibility%3A%20100%20%7C%20Best%20Practices%3A%20100%20%7C%20SEO%3A%20100-success)

Ultraschneller Meme-Coin Trading Bot mit &lt;80ms Latenz und erweiterten Rug-Schutz. Vollständig reguliert nach dem Liechtensteiner TVTG-Rahmenwerk.

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

## Lighthouse CI

Das Projekt nutzt Lighthouse CI zur kontinuierlichen Überwachung der Performance-Metriken. Der CI-Workflow prüft automatisch, dass alle Core Web Vitals den folgenden Anforderungen entsprechen:

- Performance: ≥ 95
- Accessibility: 100
- Best Practices: 100
- SEO: 100

## TVTG-Compliance

Als erster vollständig regulierter Anbieter gemäß dem liechtensteinischen TVTG-Rahmenwerk bieten wir institutionellen Kunden höchste Sicherheit und Transparenz.

---

© Axiom Enterprise AG. Alle Rechte vorbehalten. 