#!/usr/bin/env bash
set -e
pkill -f "next dev" || true
npm run dev
