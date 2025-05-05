#!/usr/bin/env bash

# Token und Site ID (hier anpassen)
NETLIFY_AUTH_TOKEN="nfp_6nDBuPgvxtRHctJ76dPqdTgLozTqPXHi10db"
NETLIFY_SITE_ID="d89ec02a-0a4e-4daf-b199-188e43c54c37"

# Build
npm ci
npm run build

# Deploy
netlify deploy --prod --dir=dist --auth $NETLIFY_AUTH_TOKEN --site $NETLIFY_SITE_ID --message "$(date +%F\ %T)"

echo "Deployment abgeschlossen!" 