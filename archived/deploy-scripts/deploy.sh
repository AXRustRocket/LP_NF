#!/usr/bin/env bash
npm ci
npm run build
netlify deploy --prod --dir=dist --message "$(date +%F\ %T)"
