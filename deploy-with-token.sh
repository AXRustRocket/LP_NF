#!/usr/bin/env bash

# Token und Site ID (hier anpassen)
NETLIFY_AUTH_TOKEN="dein-auth-token-hier"
NETLIFY_SITE_ID="deine-site-id-hier"

# Build
npm ci
npm run build

# Deploy
netlify deploy --prod --dir=dist --auth $NETLIFY_AUTH_TOKEN --site $NETLIFY_SITE_ID --message "$(date +%F\ %T)"

echo "Deployment abgeschlossen!" 