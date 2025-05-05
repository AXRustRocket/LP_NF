# Netlify Git-Deploy Setup Anleitung

Diese Anleitung beschreibt die Einrichtung des Git-basierten Deployments für die Rust Rocket Website auf Netlify.

## Übersicht

Die Migration vom manuellen Deployment-Flow zu einer Git-basierten, automatisierten CI/CD-Pipeline umfasst folgende Schritte:

1. Repository-Umstellung
2. Netlify Konfiguration
3. Umgebungsvariablen Setup
4. Supabase Integration

## 1. Repository-Umstellung

Die Codebasis wurde zum neuen Repository https://github.com/AXRustRocket/LP_NF.git migriert:

```bash
# Remote entfernen und neu hinzufügen
git remote remove origin
git remote add origin https://github.com/AXRustRocket/LP_NF.git
git branch -M main

# .gitignore anpassen für Secrets-Schutz
# .gitignore wurde aktualisiert, um sicherzustellen, dass keine Secrets gepusht werden

# Alle Dateien committen und pushen
git add .
git commit -m "chore: migrate project to LP_NF repo + latest waitlist rebuild"
git push -u origin main --force
```

## 2. Netlify Konfiguration

Die Netlify-Site (ID: 5ce2eb18-4180-4f69-adb4-e110eb5df787, Domain: rust-rocket.com) muss wie folgt konfiguriert werden:

1. In der Netlify UI:
   - Site Settings > Build & deploy > Continuous Deployment öffnen
   - Under "Build settings", Repository auswählen: https://github.com/AXRustRocket/LP_NF.git
   - Branch: main
   - Base directory: /
   - Build command: npm run build
   - Publish directory: dist

2. Netlify Build Hooks:
   - Site Settings > Build & deploy > Build hooks
   - Neuen Build Hook erstellen für CI-Integrationen

3. Deploy Contextual Split Testing aktivieren:
   - Site Settings > Continuous deployment > Deploy contexts
   - "Deploy Git submodules" aktivieren
   - Bei "Branch deploys" auf "All" setzen für Feature-Branch-Testing

## 3. Umgebungsvariablen Setup

Die Umgebungsvariablen müssen im Netlify Dashboard eingerichtet werden:

1. Site Settings > Environment variables > Environment variables öffnen
2. Folgende Variablen anlegen (mit "functions" als Scope):
   - `SUPABASE_URL`: https://jpvbnbphgvtokbrlctke.supabase.co
   - `SUPABASE_SERVICE_KEY`: [Der Service-Rollen-Key aus Supabase]
   - `SUPABASE_ANON_KEY`: [Der öffentliche Anon-Key aus Supabase]

## 4. Supabase Integration

Das Waitlist-Table muss in Supabase konfiguriert werden:

1. Im Supabase Dashboard:
   - SQL-Editor öffnen
   - Die Datei `supabase_waitlist_table.sql` ausführen:

```sql
drop table if exists public.waitlist cascade;
create extension if not exists "pgcrypto";
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text,
  marketing_ok boolean default false,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  gclid text,
  fbclid text,
  referral_code text,
  created_at timestamptz default now()
);
alter table public.waitlist enable row level security;
create policy "insert_any" on public.waitlist
  for insert with check (true); 
```

## 5. Smoke-Tests und QA

Nach erfolgreichem Setup und erstem Git-Deploy:

1. Die Live-Site in einem Inkognito-Fenster testen:
   - Banner erscheint und Accept/Decline funktioniert korrekt
   - "🚀 Join Waitlist" im Header öffnet Modal-Dialog
   - Test-E-Mail kann erfolgreich abgeschickt werden
   - Einträge in der Supabase `waitlist`-Tabelle erscheinen
   - Netlify Functions Log zeigt keine Fehler

2. Ausführen der Playwright-Tests:
   ```
   npm run test:smoke
   ```

## 6. Deployment Debug & Monitoring

Bei Problemen mit dem Git-basierten Deployment:

1. Deployment Logs prüfen:
   - In Netlify Dashboard > Deploys > [Neuestes Deploy] > Deployment log

2. Build-Probleme debuggen:
   - Bei lokalen Tests sicherstellen, dass der Build-Prozess sauber läuft

3. Netlify-Funktion Status prüfen:
   - Netlify Dashboard > Functions
   - Lambda-Funktion Tests durchführen

---

## Referenzen

- [Netlify Git-based Continuous Deployment Docs](https://docs.netlify.com/configure-builds/get-started/)
- [Supabase JavaScript API Reference](https://supabase.com/docs/reference/javascript/installing) 